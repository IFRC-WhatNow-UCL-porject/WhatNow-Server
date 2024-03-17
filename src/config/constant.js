const userConstant = {
    EMAIL_VERIFIED_TRUE: 1,
    EMAIL_VERIFIED_FALSE: 0,
    STATUS_ACTIVE: 1,
    STATUS_INACTIVE: 0,
};


const userRoles = {
    NS_ADMIN: 1,
    NS_EDITOR: 2,
    API_USER: 3,
    SUPER_ADMIN: 4,
    GDPC_ADMIN: 5,
    REVIEWER: 6,
};
const permission = {
    audit_log: [userRoles.NS_ADMIN, userRoles.NS_EDITOR, userRoles.GDPC_ADMIN],
    bulk_upload: [userRoles.NS_ADMIN, userRoles.NS_EDITOR, userRoles.GDPC_ADMIN],
    content_message: [userRoles.NS_ADMIN, userRoles.NS_EDITOR, userRoles.GDPC_ADMIN],
    content: [userRoles.NS_ADMIN, userRoles.NS_EDITOR, userRoles.GDPC_ADMIN],
    language: [userRoles.NS_ADMIN, userRoles.NS_EDITOR, userRoles.GDPC_ADMIN],
    region: [userRoles.NS_ADMIN, userRoles.NS_EDITOR, userRoles.GDPC_ADMIN],

    publish: [userRoles.NS_ADMIN, userRoles.GDPC_ADMIN],

    messages: [userRoles.NS_ADMIN, userRoles.NS_EDITOR, userRoles.GDPC_ADMIN, userRoles.REVIEWER, userRoles.API_USER],
    profile: [userRoles.NS_ADMIN, userRoles.NS_EDITOR, userRoles.GDPC_ADMIN, userRoles.REVIEWER, userRoles.API_USER],
    society: [userRoles.NS_ADMIN, userRoles.NS_EDITOR, userRoles.GDPC_ADMIN, userRoles.REVIEWER, userRoles.API_USER],

    api: [userRoles.REVIEWER, userRoles.API_USER, userRoles.GDPC_ADMIN],

    api_user: [userRoles.GDPC_ADMIN],
    user: [userRoles.GDPC_ADMIN],
    term: [userRoles.GDPC_ADMIN],
};
const contentTypes = {
    ACTIVE_SHOOTER: "active shooter",
    AIR_QUALITY: "air quality",
    AIR: "air",
    AIRBORNE_DISEASE: "airborne disease",
    ANIMAL_BORNE_DISEASE: "animal borne disease",
    AVALANCHE: "avalanche",
    BIOLOGICAL_HAZARD: "biological hazard",
    BLIZZARD: "blizzard",
    BLOODBORNE_DISEASE: "bloodborne disease",
    BODY_FLUID_BORNE_DISEASE: "body fluid borne disease",
    CHEMICAL_HAZARD: "chemical hazard",
    CHILD_SAFETY: "child safety",
    COASTAL_FLOOD: "coastal flood",
    COASTAL: "coastal",
    DENSE_FOG: "dense fog",
    DROUGHT: "drought",
    DUST_STORM: "dust storm",
    EARTHQUAKE: "earthquake",
    EPIDEMIC: "epidemic",
    EXTREME_COLD: "extreme cold",
    EXTREME_FIRE: "extreme fire",
    EXTREME_HEAT: "extreme heat",
    FLASH_FLOOD: "flash flood",
    FLOOD: "flood",
    FOODBORNE_DISEASE: "foodborne disease",
    GENERAL: "general",
    HAILSTORM: "hailstorm",
    HEATWAVE: "heatwave",
    HURRICANE_ALT: "hurricane alt",
    HURRICANE_FORCE_WIND: "hurricane force wind",
    HYDROLOGIC_ADVISORY: "hydrologic advisory",
    LAKESHORE: "lakeshore",
    LANDSLIDE: "landslide",
    MARINE_WEATHER: "marine weather",
    NUCLEAR_POWER_PLANT: "nuclear power plant",
    NUCLEAR: "nuclear",
    PANDEMIC: "pandemic",
    PEST_INFESTATION: "pest infestation",
    PUBLIC_HEALTH_STATEMENT: "public health statement",
    RADIOLOGICAL_HAZARD: "radiological hazard",
    ROAD_WORKS: "road works",
    SEVERE_THUNDERSTORM_WARNING: "severe thunderstorm warning",
    STORM_ALT: "storm alt",
    TERROR_ALERT: "terror alert",
    TORNADO: "tornado",
    TROPICAL_CYCLONE: "tropical cyclone",
    TSUNAMI: "tsunami",
    VOLCANO: "volcano",
    WIND: "wind"
};
const messageTypes = {
    MITAGATION: "Longer term actions to reduce risks",
    SEASONAL_FORECAST: "Shorter term actions to reduce risks",
    WATCH: "Prepare to respond",
    WARNING: "Prepare to respond",
    IMMEDIATE: "Response actions",
    RECOVER: "Recovery actions"
}
const language_code = {
    EN: 'English',
    ES: 'Spanish',
    FR: 'French',
    PT: 'Portuguese',
    RU: 'Russian',
    ZH: 'Chinese',
    AR: 'Arabic',
    HI: 'Hindi',
    BN: 'Bengali',
    UR: 'Urdu',
    VI: 'Vietnamese',
}
const action = {
    CREATE: 'Created Content',
    UPDATE: 'Updated Content',
    DELETE: 'Deleted Content',
    IMPORT: 'Updated content via import',
    PUBLISH: 'Published a content translation'
}
const industry_type = {
    PROFIT: 'Profit',
    NONPROFIT: 'Non Profit',
    OTHER: 'Other'
}


module.exports = {
    userConstant,
    userRoles,
    permission,
    contentTypes,
    messageTypes,
    language_code,
    action,
    industry_type
};
