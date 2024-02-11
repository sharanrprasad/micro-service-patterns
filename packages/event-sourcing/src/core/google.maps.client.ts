import { ApiClient } from "./api.client";
import { AppApiClient } from "./ioc";
import { ConfigClient, ConfigKeys } from "./config.client";
import {
  Client as GMapClient,
  PlaceAutocompleteResult,
} from "@googlemaps/google-maps-services-js";

@AppApiClient
export default class GoogleMapsClient extends ApiClient {
  private gMapClient: GMapClient;

  constructor(public configClient: ConfigClient) {
    super();
    this.gMapClient = new GMapClient();
  }

  async getPlacesAutoComplete(
    placeText: string,
  ): Promise<PlaceAutocompleteResult[]> {
    const result = await this.gMapClient.placeAutocomplete({
      params: {
        input: placeText,
        key: this.configClient.get(ConfigKeys.GOOGLE_MAPS_API_KEY),
      },
    });
    return result.data.predictions;
  }

  async getGeoCodedData(placeId: string) {
    const result = await this.gMapClient.geocode({
      params: {
        place_id: placeId,
        key: this.configClient.get(ConfigKeys.GOOGLE_MAPS_API_KEY),
      },
    });
    return result.data.results;
  }

  async optimiseWayPoints(originId: string, waypointIds: string[]) {
    const result = await this.gMapClient.directions({
      params: {
        origin: `place_id:${originId}`,
        destination: `place_id:${originId}`,
        key: this.configClient.get(ConfigKeys.GOOGLE_MAPS_API_KEY),
        optimize: true,
        waypoints: waypointIds.map((id) => `place_id:${id}`),
      },
    });
    return result.data.routes?.[0].waypoint_order;
  }
}
