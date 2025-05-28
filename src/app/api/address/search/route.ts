import { NextRequest, NextResponse } from "next/server";

interface NominatimResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  address: {
    house_number?: string;
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    county?: string;
    state?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
  };
}

interface AddressResult {
  id: string;
  label: string;
  streetNumber?: string;
  streetName?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  importance: number;
  type: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "5");
    const state = searchParams.get("state") || "MA";
    const city = searchParams.get("city") || "Boston";

    if (!query || query.length < 3) {
      return NextResponse.json(
        { error: "Query must be at least 3 characters long" },
        { status: 400 }
      );
    }

    const searchQuery = `${query}, ${city}, ${state}, USA`;

    const nominatimUrl = new URL("https://nominatim.openstreetmap.org/search");
    nominatimUrl.searchParams.set("format", "json");
    nominatimUrl.searchParams.set("q", searchQuery);
    nominatimUrl.searchParams.set("limit", limit.toString());
    nominatimUrl.searchParams.set("countrycodes", "us");
    nominatimUrl.searchParams.set("addressdetails", "1");
    nominatimUrl.searchParams.set("accept-language", "en");

    nominatimUrl.searchParams.set("bounded", "1");
    nominatimUrl.searchParams.set(
      "viewbox",
      "-71.191155,42.227925,-70.986365,42.396671"
    );

    const response = await fetch(nominatimUrl.toString(), {
      headers: {
        "User-Agent": "TalentBridge/1.0 (Boston Address Search)",
      },
    });

    if (!response.ok) {
      throw new Error(`Nominatim API error: ${response.status}`);
    }

    const data: NominatimResult[] = await response.json();

    // Transform data pour le frontend
    const addresses: AddressResult[] = data.map((result) => ({
      id: result.place_id.toString(),
      label: result.display_name,
      streetNumber: result.address.house_number,
      streetName: result.address.road,
      neighborhood: result.address.neighbourhood || result.address.suburb,
      city: result.address.city || result.address.county,
      state: result.address.state,
      zipCode: result.address.postcode,
      country: result.address.country,
      coordinates: {
        lat: parseFloat(result.lat),
        lng: parseFloat(result.lon),
      },
      importance: result.importance,
      type: result.type,
    }));

    const bostonAddresses = addresses
      .filter(
        (addr) =>
          addr.city?.toLowerCase().includes("boston") ||
          addr.state?.toLowerCase().includes("massachusetts") ||
          addr.state?.toLowerCase().includes("ma")
      )
      .sort((a, b) => b.importance - a.importance);

    return NextResponse.json({
      success: true,
      query,
      count: bostonAddresses.length,
      addresses: bostonAddresses,
    });
  } catch (error) {
    console.error("Address search error:", error);
    return NextResponse.json(
      {
        error: "Failed to search addresses",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
