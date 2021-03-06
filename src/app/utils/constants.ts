export class Constants {
  public static readonly types = [
    'CERTIFICATE OF PURCHASE',
    'CROWN GRANT',
    'DEVELOPMENT AGREEMENT',
    'DOMINION PATENTS',
    'INCLUSION',
    'INVENTORY',
    'LEASE',
    'LICENCE',
    'OIC ECOLOGICAL RESERVE ACT',
    'PERMIT',
    'PRE-TANTALIS',
    'PROVINCIAL PARK',
    'RESERVE/NOTATION',
    'REVENUE SHARING AGREEMENT',
    'RIGHT-OF-WAY',
    'TRANSFER OF ADMINISTRATION/CONTROL'
  ];

  public static readonly subtypes = {
    'CERTIFICATE OF PURCHASE': [
      'DIRECT SALE',
      'FROM LEASE-PURCHASE OPTION',
      'PRE-TANTALIS CERTIFICATE OF PURCHASE',
      'TEMPORARY CODE'
    ],
    'CROWN GRANT': [
      'DIRECT SALE',
      'FREE CROWN GRANT',
      'FROM LEASE-PURCHASE OPTION',
      'HISTORIC',
      'HISTORIC CROWN GRANT',
      'LAND EXCHANGE',
      'PRE-EMPTION',
      'PRE-TANTALIS CROWN GRANT',
      'TEMPORARY CODE'
    ],
    'DEVELOPMENT AGREEMENT': [
      'ALPINE SKI DEVELOPMENT',
      'PRE-TANTALIS DEVELOPMENTAL AGREEMENT'
    ],
    'DOMINION PATENTS': [
      'PRE-TANTALIS DOMINION PATENTS'
    ],
    'INCLUSION': [
      'ACCESS',
      'AGREEMENT',
      'INCLUSION',
      'LAND TITLE ACT ACCRETION',
      'LAND TITLE ACT BOUNDARY ADJUSTMENT',
      'PRE-TANTALIS INCLUSION'
    ],
    'INVENTORY': [
      'BCAL INVENTORY'
    ],
    'LEASE': [
      'HEAD LEASE',
      'LEASE - PURCHASE OPTION',
      'PRE-TANTALIS LEASE',
      'STANDARD LEASE'
    ],
    'LICENCE': [
      'LICENCE OF OCCUPATION',
      'PRE-TANTALIS LICENCE'
    ],
    'OIC ECOLOGICAL RESERVE ACT': [
      'OIC ECOLOGICAL RESERVES',
      'PRE-TANTALIS OIC ECO RESERVE'
    ],
    'PERMIT': [
      'INVESTIGATIVE PERMIT',
      'PRE-TANTALIS PERMIT',
      'ROADS & BRIDGES',
      'TEMPORARY CODE',
      'TEMPORARY PERMIT'
    ],
    'PRE-TANTALIS': [
      'PRE-TANTALIS'
    ],
    'PROVINCIAL PARK': [
      'PARKS',
      'PRE-TANTALIS PARKS',
      'PRE-TANTALIS PARKS (00 ON TAS/CLR)'
    ],
    'RESERVE/NOTATION': [
      'DESIGNATED USE AREA',
      'MAP RESERVE',
      'NOTATION OF INTEREST',
      'OIC RESERVE',
      'PRE-TANTALIS RESERVE/NOTATION',
      'PROHIBITED USE AREA',
      'TEMPORARY CODE'
    ],
    'REVENUE SHARING AGREEMENT': [
      'REVENUE SHARING AGREEMENT'
    ],
    'RIGHT-OF-WAY': [
      'INTERIM LICENCE',
      'STATUTORY RIGHT OF WAY OR EASEMENT',
      'PRE-TANTALIS RIGHT-OF-WAY'
    ],
    'TRANSFER OF ADMINISTRATION/CONTROL': [
      'FED TRANSFER OF ADMIN, CONTROL & BEN',
      'PRE-TANTALIS TRANSFER OF ADMIN/CONT',
      'PROVINCIAL TRANSFER OF ADMIN'
    ]
  };

  public static readonly statuses = [
    'ABANDONED', // may not be an actual status
    'ACCEPTED',
    'ACTIVE',
    'ALLOWED',
    'CANCELLED',
    'COMPLETED',
    'DISALLOWED',
    'DISPOSITION IN GOOD STANDING',
    'EXPIRED',
    'HISTORIC',
    'NOT USED',
    'OFFER ACCEPTED',
    'OFFER NOT ACCEPTED',
    'OFFER RESCINDED',
    'OFFERED',
    'PENDING',
    'PRE-TANTALIS',
    'RECEIVED',
    'RETURNED',
    'REVERTED',
    'SOLD',
    'SUSPENDED',
    'WITHDRAWN'
  ];

  public static readonly purposes = [
    'AGRICULTURE',
    'ALL SEASONS RESORT',
    'ALPINE SKIING',
    'AQUACULTURE',
    'COMMERCIAL',
    'COMMERCIAL RECREATION',
    'COMMUNICATION',
    'COMMUNITY',
    'ENERGY PRODUCTION',
    'ENVIRONMENT, CONSERVATION, & RECR',
    'FIRST NATIONS',
    'INDUSTRIAL',
    'INSTITUTIONAL',
    'MISCELLANEOUS LAND USES',
    'OCEAN ENERGY',
    // 'PRE-TANTALIS', // ACRFD does not have pre-Tantalis apps
    'QUARRYING',
    'RESIDENTIAL',
    'SOLAR POWER',
    'TRANSPORTATION',
    'UTILITY',
    'WATERPOWER',
    'WINDPOWER'
  ];

  // list of subpurposes according to Tantalis
  // NB: order of subpurposes is code order in Tantalis
  public static readonly subpurposes = {
    'AGRICULTURE': [
      'EXTENSIVE',
      'INTENSIVE',
      'GRAZING',
    ],
    'ALL SEASONS RESORT': [
      'MISCELLANEOUS',
    ],
    'ALPINE SKIING': [
      'GENERAL',
      'LIFTS',
      'RUNS/TRAILS',
      'DAY SKIER FACILITY',
      'INDEPENDENT RECREATION FACILITY',
      'MAINTENANCE FACILITY',
      'PARKING FACILITY',
      'RESIDENTIAL',
      'COMMERCIAL RESIDENTIAL',
      'CONTROLLED RECREATION AREA',
      'MISCELLANEOUS',
      'SUPPORT UTILITY',
    ],
    'AQUACULTURE': [
      'FIN FISH',
      'SHELL FISH',
      'PLANTS',
      'CRUSTACEANS',
    ],
    'COMMERCIAL': [
      'GENERAL',
      'COMMERCIAL A',
      'COMMERCIAL B',
      'GOLF COURSE',
      'COMMERCIAL WHARF',
      'TRAPLINE CABIN',
      'FILM PRODUCTION',
      'MARINA',
      'PRIVATE YACHT CLUB',
      'MISCELLANEOUS',
      'MECHANIZED SKI GUIDING',
      'HUNTING/FISHING CAMP',
      'BACK-COUNTRY RECREATION',
      'RESORT HUNT/FISH CAMPS & WHARVES',
      'COMMERCIAL RECREATION DOCK',
    ],
    'COMMERCIAL RECREATION': [
      'HELI SKI',
      'CAT SKI',
      'NORDIC SKI (X COUNTRY SKIING)',
      'SNOWMOBILING',
      'HUNT CAMPS',
      'FISH CAMPS',
      'TIDAL SPORTS FISHING CAMPS',
      'PRIVATE CAMPS',
      'COMMUNITY OUTDOOR RECREATION',
      'GUIDED NATURE VIEWING',
      'GUIDED FRESHWATER RECREATION',
      'GUIDED SALTWATER RECREATION',
      'GUIDED MOUNTAINEERING/ROCK CLIMBING',
      'GUIDED CAVING',
      'MULTIPLE USE',
      'MISCELLANEOUS',
      'TRAIL RIDING',
      'HELI HIKING',
      'ECO TOURIST LODGE/RESORT',
      'SPECIAL ACTIVITIES',
    ],
    'COMMUNICATION': [
      'COMMUNICATION SITES',
      'COMBINED USES',
    ],
    'COMMUNITY': [
      'COMMUNITY FACILITY',
      'MISCELLANEOUS',
      'TRAIL MAINTENANCE',
    ],
    'ENERGY PRODUCTION': [
      'GENERAL',
      'BATTERY SITE',
      'COMPRESSOR SITE',
      'DEHYDRATOR SITE',
      'FLARESITE',
      'INLET SITE',
      'METER SITE',
      'WATER ANALYZER',
      'DRILLSITE/WELLSITE',
      'REFINERY',
      'GAS PROCESSING PLANT',
      'MAJOR COMPRESSION FACILITY',
      'NON-FIELD TANK FARMS',
      'LAND FARMS',
      'CAMPSITE',
    ],
    'ENVIRONMENT, CONSERVATION, & RECR': [
      'ECOLOGICAL RESERVE',
      'GREENBELT',
      'WATERSHED RESERVE',
      'FISH AND WILDLIFE MANAGEMENT',
      'PUBLIC ACCESS/PUBLIC TRAILS',
      'FOREST MANAGEMENT RESEARCH',
      'FISHERY FACILITY',
      'UREP/RECREATION RESERVE',
      'FLOODING RESERVE',
      'SCIENCE MEASUREMENT/RESEARCH',
      'BUFFER ZONE',
      'ENVIRONMENT PROTECTION/CONSERVATION',
      'BOAT HAVEN',
      'HERITAGE/ARCHEOLOGICAL SITE',
      'PROTECTED AREA STRATEGY',
      'SNOW SURVEY',
    ],
    'FIRST NATIONS': [
      'INDIAN CUT-OFF',
      'RESERVE EXPANSION',
      'TREATY AREA',
      'SPECIFIC CLAIMS',
      'ROADS',
      'LAND CLAIM SETTLEMENT',
      'CULTURAL SIGNIFICANCE',
      'TRADITIONAL USE',
      'INTERIM MEASURES',
      'COMMUNITY FACILITY',
    ],
    'INDUSTRIAL': [
      'GENERAL',
      'LIGHT INDUSTRIAL',
      'HEAVY INDUSTRIAL',
      'LOG HANDLING/STORAGE',
      'MINERAL PRODUCTION',
      'INDUSTRIAL CAMPS',
      'MISCELLANEOUS',
    ],
    'INSTITUTIONAL': [
      'FIRE HALL',
      'LOCAL/REGIONAL PARK',
      'HOSPITAL/HEALTH FACILITY',
      'INDOOR RECREATION FACILITY',
      'SCHOOL/OUTDOOR EDUCATION FACILITY',
      'WASTE DISPOSAL SITE',
      'CEMETERY',
      'PUBLIC WORKS',
      'POLICE FACILITY',
      'CORRECTIONS FACILITY',
      'MILITARY SITE',
      'MISCELLANEOUS',
    ],
    'MISCELLANEOUS LAND USES': [
      'PLANNING/MARKETING/DEVELOP PROJECTS',
      'LAND EXCHANGE',
      'OTHER',
      'LAND USE PLAN INTERIM AGREEMENT',
    ],
    'OCEAN ENERGY': [
      'INVESTIGATIVE AND MONITORING PHASE',
      'GENERAL AREA',
    ],
    // 'PRE-TANTALIS': [
    //   'PRE-TANTALIS', // ACRFD does not have pre-Tantalis apps
    // ],
    'QUARRYING': [
      'SAND AND GRAVEL',
      'PEAT AND SOIL',
      'LIMESTONE AND DOLOMITE',
      'POZZOLAN, CLAY, DIATOMACEOUS EARTH',
      'MISCELLANEOUS',
      'ROCK FOR CRUSHING',
      'CONSTRUCTION STONE',
      'RIP RAP',
      'PUBLIC SAFETY - FLOOD MITIGATION',
    ],
    'RESIDENTIAL': [
      'URBAN RESIDENTIAL',
      'RURAL RESIDENTIAL',
      'REMOTE RESIDENTIAL',
      'FLOATING COMMUNITY',
      'FLOATING CABIN',
      'PRIVATE MOORAGE',
      'MISCELLANEOUS',
      'RECREATIONAL RESIDENTIAL',
      'STRATA MOORAGE',
      'THERMAL LOOPS',
      'APPLICATION ONLY - PRIVATE MOORAGE',
    ],
    'SOLAR POWER': [
      'INVESTIGATIVE PHASE',
    ],
    'TRANSPORTATION': [
      'AIRPORT/AIRSTRIP',
      'ROADWAY',
      'RAILWAY',
      'FERRY TERMINAL',
      'PUBLIC WHARF',
      'NAVIGATION AID',
      'BRIDGES',
    ],
    'UTILITY': [
      'ELECTRIC POWER LINE',
      'GAS AND OIL PIPELINE',
      'TELECOMMUNICATION LINE',
      'WATER LINE',
      'SEWER/EFFLUENT LINE',
      'MISCELLANEOUS',
      'CATHODIC SITE/ANODE BEDS',
    ],
    'WATERPOWER': [
      'GENERAL AREA',
      'POWERHOUSE SITE',
      'PENSTOCK',
      'TRANSMISSION LINE',
      'ROAD',
      'COMMUNICATION SITE',
      'QUARRY',
      'INVESTIGATIVE PHASE',
      'CAMP',
      'INTAKE',
      'NON-COMMERCIAL',
    ],
    'WINDPOWER': [
      'INVESTIGATIVE AND MONITORING PHASE',
      'DEVELOPMENT PHASE',
      'OPERATING PHASE',
      'INVESTIGATIVE PHASE',
      'GENERAL AREA',
      'INTENSIVE',
      'EXTENSIVE',
      'TRANSMISSION LINE',
      'ROAD',
      'QUARRY',
      'COMMUNICATION SITE',
      'NON-COMMERCIAL',
    ]
  };
}
