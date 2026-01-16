// BASED ON GEOAPIFY CATEGORYS

export const SIGHTSEEING_CATEGORY_LABELS = {
  // --- General tourism ---
  "tourism.attraction": "Attraction",
  "tourism.sights": "Sight",
  "tourism.information": "Tourist Information",

  // --- Information ---
  "tourism.information.office": "Tourist Information",
  "tourism.information.map": "Tourist Information",
  "tourism.information.ranger_station": "Ranger Station",

  // --- Attractions ---
  "tourism.attraction.artwork": "Public Artwork",
  "tourism.attraction.viewpoint": "Viewpoint",
  "tourism.attraction.fountain": "Fountain",
  "tourism.attraction.clock": "Clock",

  // --- Squares & civic ---
  "tourism.sights.square": "Public Square",
  "tourism.sights.city_hall": "City Hall",
  "tourism.sights.conference_centre": "Conference Centre",
  "tourism.sights.city_gate": "City Gate",

  // --- Religious buildings ---
  "tourism.sights.place_of_worship": "Place of Worship",
  "tourism.sights.place_of_worship.church": "Church",
  "tourism.sights.place_of_worship.chapel": "Chapel",
  "tourism.sights.place_of_worship.cathedral": "Cathedral",
  "tourism.sights.place_of_worship.mosque": "Mosque",
  "tourism.sights.place_of_worship.synagogue": "Synagogue",
  "tourism.sights.place_of_worship.temple": "Temple",
  "tourism.sights.place_of_worship.shrine": "Shrine",
  "tourism.sights.monastery": "Monastery",

  // --- Historic & defensive ---
  "tourism.sights.castle": "Castle",
  "tourism.sights.fort": "Fort",
  "tourism.sights.battlefield": "Battlefield",
  "tourism.sights.archaeological_site": "Archaeological Site",
  "tourism.sights.ruines": "Ruins",
  "tourism.sights.tower": "Tower",
  "tourism.sights.bridge": "Historic Bridge",

  // --- Infrastructure / landmarks ---
  "tourism.sights.lighthouse": "Lighthouse",
  "tourism.sights.windmill": "Windmill",

  // --- Memorials (collapsed into sensible labels) ---
  "tourism.sights.memorial": "Memorial",
  "tourism.sights.memorial.monument": "Monument",
  "tourism.sights.memorial.tomb": "Tomb",
  "tourism.sights.memorial.necropolis": "Necropolis",
  "tourism.sights.memorial.tumulus": "Burial Mound",
  "tourism.sights.memorial.wayside_cross": "Wayside Cross",
  "tourism.sights.memorial.boundary_stone": "Boundary Stone",
  "tourism.sights.memorial.milestone": "Milestone",
  "tourism.sights.memorial.pillory": "Pillory",

  // --- Transport-related memorials ---
  "tourism.sights.memorial.aircraft": "Aircraft Memorial",
  "tourism.sights.memorial.ship": "Ship Memorial",
  "tourism.sights.memorial.locomotive": "Locomotive Memorial",
  "tourism.sights.memorial.railway_car": "Railway Memorial",
  "tourism.sights.memorial.tank": "Tank Memorial",


  // --- General ---
  "entertainment": "Entertainment",
  "entertainment.culture": "Cultural Venue",

  // --- Culture ---
  "entertainment.culture.theatre": "Theatre",
  "entertainment.culture.arts_centre": "Arts Centre",
  "entertainment.culture.gallery": "Art Gallery",

  // --- Museums & exhibitions ---
  "entertainment.museum": "Museum",
  "entertainment.planetarium": "Planetarium",
  "entertainment.aquarium": "Aquarium",
  "entertainment.zoo": "Zoo",

  // --- Cinema & games ---
  "entertainment.cinema": "Cinema",
  "entertainment.amusement_arcade": "Arcade",
  "entertainment.escape_game": "Escape Room",

  // --- Leisure & activities ---
  "entertainment.miniature_golf": "Mini Golf",
  "entertainment.bowling_alley": "Bowling Alley",
  "entertainment.flying_fox": "Zip Line",

  // --- Theme & water parks ---
  "entertainment.theme_park": "Theme Park",
  "entertainment.water_park": "Water Park",

  // --- Activity parks ---
  "entertainment.activity_park": "Activity Park",
  "entertainment.activity_park.trampoline": "Trampoline Park",
  "entertainment.activity_park.climbing": "Climbing Centre",
};


export function getSightseeingCategoryLabel(categories = []) {
  for (const c of categories) {
    // exact match
    if (SIGHTSEEING_CATEGORY_LABELS[c]) {
      return SIGHTSEEING_CATEGORY_LABELS[c];
    }

    // fallback 
    const parent = c.split(".").slice(0, 2).join(".");
    if (SIGHTSEEING_CATEGORY_LABELS[parent]) {
      return SIGHTSEEING_CATEGORY_LABELS[parent];
    }
  }

  return "Place";
}