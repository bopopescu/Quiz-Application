# Copyright 2015 Google Inc. All Rights Reserved.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""Command for updating a BGP peer on a Google Compute Engine router."""

from googlecloudsdk.api_lib.compute import base_classes
from googlecloudsdk.api_lib.compute import routers_utils
from googlecloudsdk.api_lib.compute.operations import poller
from googlecloudsdk.api_lib.util import waiter
from googlecloudsdk.calliope import base
from googlecloudsdk.command_lib.compute.routers import flags
from googlecloudsdk.command_lib.compute.routers import router_utils
from googlecloudsdk.core import log
from googlecloudsdk.core import resources


@base.ReleaseTracks(base.ReleaseTrack.GA, base.ReleaseTrack.BETA)
class UpdateBgpPeer(base.UpdateCommand):
  """Update a BGP peer on a Google Compute Engine router."""

  ROUTER_ARG = None

  @classmethod
  def Args(cls, parser):
    cls.ROUTER_ARG = flags.RouterArgument()
    cls.ROUTER_ARG.AddArgument(parser)
    flags.AddBgpPeerArgs(parser)

  def Run(self, args):
    holder = base_classes.ComputeApiHolder(self.ReleaseTrack())
    api_client = holder.client.apitools_client
    messages = holder.client.messages
    service = api_client.routers

    ref = self.ROUTER_ARG.ResolveAsResource(args, holder.resources)

    request_type = messages.ComputeRoutersGetRequest
    replacement = service.Get(request_type(**ref.AsDict()))

    _UpdateBgpPeer(replacement, args)

    request_type = messages.ComputeRoutersPatchRequest
    resource = service.Patch(
        request_type(
            project=ref.project,
            region=ref.region,
            router=ref.Name(),
            routerResource=replacement))

    return resource


UpdateBgpPeer.detailed_help = {
    'DESCRIPTION':
        """
        *{command}* is used to update a BGP peer on a Google Compute Engine
        router.
        """,
}


@base.ReleaseTracks(base.ReleaseTrack.ALPHA)
class UpdateBgpPeerAlpha(base.UpdateCommand):
  """Update a BGP peer on a Google Compute Engine router."""

  ROUTER_ARG = None

  @classmethod
  def Args(cls, parser):
    cls.ROUTER_ARG = flags.RouterArgument()
    cls.ROUTER_ARG.AddArgument(parser)
    base.ASYNC_FLAG.AddToParser(parser)
    flags.AddBgpPeerArgs(parser, for_add_bgp_peer=False)
    flags.AddCustomAdvertisementArgs(parser, 'peer')

  def Run(self, args):
    # Manually ensure replace/incremental flags are mutually exclusive.
    router_utils.CheckIncompatibleFlagsOrRaise(args)

    holder = base_classes.ComputeApiHolder(self.ReleaseTrack())
    messages = holder.client.messages
    service = holder.client.apitools_client.routers

    router_ref = self.ROUTER_ARG.ResolveAsResource(args, holder.resources)

    request_type = messages.ComputeRoutersGetRequest
    replacement = service.Get(request_type(**router_ref.AsDict()))

    # Retrieve specified peer and update base fields.
    peer = _UpdateBgpPeer(replacement, args)

    if router_utils.HasReplaceAdvertisementFlags(args):
      mode, groups, ranges = router_utils.ParseAdvertisements(
          messages=messages, resource_class=messages.RouterBgpPeer, args=args)

      router_utils.PromptIfSwitchToDefaultMode(
          messages=messages,
          resource_class=messages.RouterBgpPeer,
          existing_mode=peer.advertiseMode,
          new_mode=mode)

      attrs = {
          'advertiseMode': mode,
          'advertisedGroups': groups,
          'advertisedIpRanges': ranges,
      }

      for attr, value in attrs.items():
        if value is not None:
          setattr(peer, attr, value)

    if router_utils.HasIncrementalAdvertisementFlags(args):
      # This operation should only be run on custom mode peers.
      router_utils.ValidateCustomMode(
          messages=messages,
          resource_class=messages.RouterBgpPeer,
          resource=peer)

      # These arguments are guaranteed to be mutually exclusive in args.
      if args.add_advertisement_groups:
        groups_to_add = routers_utils.ParseGroups(
            resource_class=messages.RouterBgpPeer,
            groups=args.add_advertisement_groups)
        peer.advertisedGroups.extend(groups_to_add)

      if args.remove_advertisement_groups:
        groups_to_remove = routers_utils.ParseGroups(
            resource_class=messages.RouterBgpPeer,
            groups=args.remove_advertisement_groups)
        router_utils.RemoveGroupsFromAdvertisements(
            messages=messages,
            resource_class=messages.RouterBgpPeer,
            resource=peer,
            groups=groups_to_remove)

      if args.add_advertisement_ranges:
        ip_ranges_to_add = routers_utils.ParseIpRanges(
            messages=messages, ip_ranges=args.add_advertisement_ranges)
        peer.advertisedIpRanges.extend(ip_ranges_to_add)

      if args.remove_advertisement_ranges:
        router_utils.RemoveIpRangesFromAdvertisements(
            messages=messages,
            resource_class=messages.RouterBgpPeer,
            resource=peer,
            ip_ranges=args.remove_advertisement_ranges)

    request_type = messages.ComputeRoutersPatchRequest
    result = service.Patch(
        request_type(
            project=router_ref.project,
            region=router_ref.region,
            router=router_ref.Name(),
            routerResource=replacement))

    operation_ref = resources.REGISTRY.Parse(
        result.name,
        collection='compute.regionOperations',
        params={
            'project': router_ref.project,
            'region': router_ref.region,
        })

    if args.async:
      log.UpdatedResource(
          operation_ref,
          kind='peer [{0}] in router [{1}]'.format(peer.name,
                                                   router_ref.Name()),
          async=True,
          details='Run the [gcloud compute operations describe] command '
          'to check the status of this operation.')
      return result

    target_router_ref = holder.resources.Parse(
        router_ref.Name(),
        collection='compute.routers',
        params={
            'project': router_ref.project,
            'region': router_ref.region,
        })

    operation_poller = poller.Poller(service, target_router_ref)
    return waiter.WaitFor(operation_poller, operation_ref,
                          'Updating peer [{0}] in router [{1}]'.format(
                              peer.name, router_ref.Name()))


def _UpdateBgpPeer(resource, args):
  """Updates base attributes of a BGP peer based on flag arguments."""

  peer = router_utils.FindBgpPeerOrRaise(resource, args.peer_name)

  attrs = {
      'interfaceName': args.interface,
      'ipAddress': args.ip_address,
      'peerIpAddress': args.peer_ip_address,
      'peerAsn': args.peer_asn,
      'advertisedRoutePriority': args.advertised_route_priority,
  }

  for attr, value in attrs.items():
    if value is not None:
      setattr(peer, attr, value)

  return peer


UpdateBgpPeerAlpha.detailed_help = {
    'DESCRIPTION':
        """
        *{command}* is used to update a BGP peer on a Google Compute Engine
        router.
        """,
}
