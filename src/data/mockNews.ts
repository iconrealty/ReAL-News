import { CityInfo, NewsArticle } from '../types';

export const CITIES: CityInfo[] = [
  {
    id: 'orange-county',
    name: 'Orange County',
    state: 'CA',
    tagline: 'Countywide Metro News, Irvine, Costa Mesa, Newport Beach, Orange & Coastal Communities',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'irvine',
    name: 'Irvine',
    state: 'CA',
    tagline: 'Official City Site: Great Park Master Plan, Spectrum Innovation & Green Housing',
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'costa-mesa',
    name: 'Costa Mesa',
    state: 'CA',
    tagline: 'Official City Site: Arts District Master Plan, South Coast Plaza & Housing Element',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'newport-beach',
    name: 'Newport Beach',
    state: 'CA',
    tagline: 'Official City Site: Harbor Dredging, Coastal Zoning & Balboa Island Updates',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'orange',
    name: 'Orange',
    state: 'CA',
    tagline: 'Official City Site: Old Towne Orange Plaza Preservation & Chapman Campus Planning',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'huntington-beach',
    name: 'Huntington Beach',
    state: 'CA',
    tagline: 'Official City Site: Pier Plaza Revitalization, Beach Protection & Main St Downtown',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'laguna-beach',
    name: 'Laguna Beach',
    state: 'CA',
    tagline: 'Official City Site: Coastal Bluff Preservation, Artist Colony & Downtown Promenade',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'anaheim',
    name: 'Anaheim',
    state: 'CA',
    tagline: 'Official City Site: $4B ocVIBE District, Anaheim Hills Housing & Resort Corridor',
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'dana-point',
    name: 'Dana Point',
    state: 'CA',
    tagline: 'Official City Site: $500M Harbor Revitalization, Lantern District & Marina Slips',
    image: 'https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'san-clemente',
    name: 'San Clemente',
    state: 'CA',
    tagline: 'Official City Site: Spanish Village by the Sea, Pier Bowl Preservation & Beach Trails',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'fullerton',
    name: 'Fullerton',
    state: 'CA',
    tagline: 'Official City Site: Downtown Historic Plaza, University Corridor & Parks Initiative',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'mission-viejo',
    name: 'Mission Viejo',
    state: 'CA',
    tagline: 'Official City Site: Core City Center Project, Lake Mission Viejo & Civic Center',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'lake-forest',
    name: 'Lake Forest',
    state: 'CA',
    tagline: 'Official City Site: Civic Center Campus, Sports Park Expansion & Business Parks',
    image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'tustin',
    name: 'Tustin',
    state: 'CA',
    tagline: 'Official City Site: Tustin Legacy Park District, Historic Old Town & Innovation Campus',
    image: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'san-juan-capistrano',
    name: 'San Juan Capistrano',
    state: 'CA',
    tagline: 'Official City Site: Historic Downtown District, Mission Preservation & Farm Corridors',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
  },
];

export const INITIAL_ARTICLES: NewsArticle[] = [
  // 1. ORANGE COUNTY (Countywide Metro & Regional Government News)
  {
    id: 'gov-oc-board-1',
    title: 'Orange County Board of Supervisors Approves $140M Regional Transit & Infrastructure Master Plan',
    subtitle: 'Official County Government Report funds major corridor upgrades connecting Irvine, Costa Mesa, Newport Beach, and City of Orange.',
    category: 'city-developments',
    cityName: 'Orange County',
    publisher: 'County of Orange Official Government Site',
    publisherLogo: '🏛️',
    publishedAt: 'Today at 08:00 AM',
    readTime: '5 min read',
    heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.ocgov.com/gov/bos',
    sourceCitation: 'Orange County Board of Supervisors Ordinance 2026-01 • OCTA Regional Transportation Framework',
    isBreaking: true,
    isFeatured: true,
    keyTakeaways: [
      'The Orange County Board of Supervisors officially ratified a $140M regional mobility initiative.',
      'Enhances arterial traffic synchronization and bus rapid transit links between Irvine Spectrum, South Coast Plaza (Costa Mesa), Newport Harbor, and Old Towne Orange.',
      'Allocates $45M for regional watershed sustainability and habitat conservation across Orange County parkways.'
    ],
    content: `The County of Orange Board of Supervisors has officially approved a milestone $140 million regional infrastructure strategy during its regular meeting at the County Administration South building in Santa Ana.

According to official public records published on the County site, the multi-city framework prioritizes high-capacity transit corridors and smart signal synchronization linking key urban hubs including Irvine, Costa Mesa, Newport Beach, and Orange.

"This landmark countywide initiative ensures seamless mobility, environmental protection, and economic integration across central and coastal Orange County," declared the Board Chairman in the official county release.

Key highlights include expanded electric bus transit routes, regional storm drain water quality upgrades, and joint municipal emergency response networks.`,
    venueDetails: {
      name: 'Orange County Government Center',
      type: 'development',
      address: '601 N Ross St, Santa Ana, CA 92701',
      highlight: '$140M Countywide Transit & Infrastructure Plan'
    }
  },

  // 2. NEWPORT BEACH (Official Municipal Government News)
  {
    id: 'gov-newport-1',
    title: 'City of Newport Beach Advances $22M Harbor Dredging & Seawall Enhancement Project',
    subtitle: 'Official City Council Report approves harbor maintenance to safeguard marine navigation, Balboa Island seawalls, and dock safety.',
    category: 'city-developments',
    cityName: 'Newport Beach',
    publisher: 'City of Newport Beach Official Municipal Site',
    publisherLogo: '🏛️',
    publishedAt: 'Today at 09:30 AM',
    readTime: '4 min read',
    heroImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.newportbeachca.gov/government/departments/public-works/harbor-resources-division',
    sourceCitation: 'City of Newport Beach City Council Resolution 2026-44 • Public Works Department Official Minutes',
    isBreaking: false,
    isFeatured: true,
    keyTakeaways: [
      'Newport Beach City Council officially authorized $22 million in public works funding for Lower Newport Bay dredging.',
      'Includes critical structural reinforcements for Balboa Island seawalls to mitigate sea level tidal surges.',
      'Public dock upgrades and pump-out station modernizations scheduled across Newport Harbor.'
    ],
    content: `The City Council of Newport Beach has officially approved a $22 million capital improvement package targeting Newport Harbor sediment management and seawall structural preservation.

According to official public works documentation released on the City's municipal site, the initiative will restore navigational depth across channels serving Lido Isle, Balboa Peninsula, and Mariners Mile.

"Maintaining the depth and coastal resilience of Newport Harbor is vital to protecting public safety, private boat slips, and municipal marine infrastructure," stated the Newport Beach City Manager in the official briefing.

Additionally, public dock access points along Balboa Island and the Fun Zone boardwalk will receive new ADA-compliant ramps, solar lighting, and expanded vessel pump-out infrastructure.`,
    venueDetails: {
      name: 'Newport Beach Municipal Harbor & City Hall',
      type: 'development',
      address: '100 Civic Center Dr, Newport Beach, CA 92660',
      highlight: '$22M Harbor Infrastructure & Seawall Initiative'
    }
  },

  // 2. IRVINE (Official Municipal Government News)
  {
    id: 'gov-irvine-1',
    title: 'City of Irvine Approves 300-Acre Great Park Botanical Garden & Cultural District Phase',
    subtitle: 'Official Irvine City Council resolution authorizes groundbreaking on $1B+ municipal urban park master plan.',
    category: 'city-developments',
    cityName: 'Irvine',
    publisher: 'City of Irvine Official Municipal Site',
    publisherLogo: '🏛️',
    publishedAt: 'Yesterday at 04:15 PM',
    readTime: '5 min read',
    heroImage: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.cityofirvine.org/great-park',
    sourceCitation: 'City of Irvine Municipal Governance • Great Park Framework Plan Committee Resolution',
    isBreaking: false,
    isFeatured: true,
    keyTakeaways: [
      'Irvine City Council voted unanimously to advance Phase 2 of the 1,300-acre Great Park Master Plan.',
      'Features a 300-acre world-class Botanical Garden, a permanent outdoor music amphitheater, and a central lake ecosystem.',
      'Designated $180M in municipal park bond funds to connect Great Park trails directly to Irvine Spectrum.'
    ],
    content: `In an official action recorded by the City Clerk of Irvine, the Irvine City Council has greenlit the execution contracts for the next major phase of the Great Park Framework.

The municipal plan allocates over 300 acres to native California botanical gardens, outdoor educational pavilions, and a 10,000-capacity amphitheater designed to host civic gatherings, symphonies, and community arts festivals.

"This landmark decision transforms former military airfield grounds into one of North America's premier municipal parks," noted Mayor and City Council members in their joint press release.

Sustainability guidelines published by the City mandate 100% recycled water irrigation, native oak reforestration, and solar-canopied pedestrian bikeways linking Irvine residential villages to the Great Park Sports Complex.`,
    realEstateData: {
      neighborhood: 'Great Park Neighborhoods & Irvine Spectrum',
      priceRange: '$1,100,000 - $3,450,000',
      avgSqftPrice: '$790/sqft',
      trend: 'up',
      keyStat: '1,300-Acre City Master Park'
    }
  },

  // 3. COSTA MESA (Official Municipal Government News)
  {
    id: 'gov-costa-mesa-1',
    title: 'City of Costa Mesa Adopts Arts District Master Plan & South Coast Plaza Housing Overlay',
    subtitle: 'City Council approves updated General Plan guidelines for walkable mixed-use housing along Town Center Drive.',
    category: 'real-estate',
    cityName: 'Costa Mesa',
    publisher: 'City of Costa Mesa Municipal Government',
    publisherLogo: '🏛️',
    publishedAt: '2 days ago',
    readTime: '4 min read',
    heroImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.costamesaca.gov/city-hall/city-departments/development-services/planning-division',
    sourceCitation: 'City of Costa Mesa Planning Commission Ordinance 2026-08 • General Plan Housing Element',
    isBreaking: false,
    isFeatured: false,
    keyTakeaways: [
      'Costa Mesa City Council approved new mixed-use zoning overlays along the Town Center and Bristol Street corridors.',
      'Encourages transit-adjacent residential housing, sidewalk cafes, and public art sculpture plazas.',
      'Preserves Segerstrom Center for the Arts and OCMA cultural access while modernizing retail spaces.'
    ],
    content: `The City Council of Costa Mesa has formally adopted the Arts District & Urban Village Master Plan update, establishing a forward-thinking zoning framework for the city's central cultural hub.

As detailed in official notices published on the municipal site, the ordinance enables property owners near South Coast Plaza and Segerstrom Center to develop pedestrian-friendly residential apartments above ground-floor dining and retail.

"Costa Mesa is proud to be the City of the Arts," stated the Costa Mesa Development Services Director. "Our updated Housing Element ensures new residential units are built in walkable, transit-oriented centers with direct access to fine art, dining, and open space."`,
    realEstateData: {
      neighborhood: 'Town Center & South Coast Metro',
      priceRange: '$750,000 - $2,200,000',
      avgSqftPrice: '$720/sqft',
      trend: 'up',
      keyStat: 'Walkable Arts Zoning Overlay'
    }
  },

  // 4. HUNTINGTON BEACH (Official Municipal Government News)
  {
    id: 'gov-hb-1',
    title: 'City of Huntington Beach Announces Pier Plaza & Main Street Revitalization Master Plan',
    subtitle: 'Official City Council release details $15M public space renovation for Surf City’s iconic downtown pier district.',
    category: 'city-developments',
    cityName: 'Huntington Beach',
    publisher: 'City of Huntington Beach Official Site',
    publisherLogo: '🏛️',
    publishedAt: '3 hours ago',
    readTime: '4 min read',
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.huntingtonbeachca.gov/government/departments/public-works/',
    sourceCitation: 'City of Huntington Beach City Council Agenda Item 2026-112 • Department of Community Development',
    isBreaking: true,
    isFeatured: true,
    keyTakeaways: [
      'Huntington Beach City Council voted to approve a $15M downtown enhancement strategy for Pier Plaza.',
      'Includes updated boardwalk paving, expanded outdoor seating for local restaurants, and enhanced beach safety towers.',
      'Reinforces coastal dune protection and public parking management along Pacific Coast Highway.'
    ],
    content: `The City of Huntington Beach has released its official Downtown & Pier Plaza Revitalization Plan following formal approval by the City Council.

Published on the municipal government site, the public works initiative funds sweeping beautification of the historic 1,850-foot Huntington Beach Pier entrance, Main Street pedestrian walkways, and beachfront amphitheater facilities.

"Huntington Beach Pier is a globally recognized landmark," said the Huntington Beach Mayor. "This investment enhances visitor safety, supports our local merchants, and preserves Surf City USA's heritage for future generations."`,
    venueDetails: {
      name: 'Huntington Beach Municipal Pier & Plaza',
      type: 'development',
      address: '325 Pacific Coast Hwy, Huntington Beach, CA 92648',
      highlight: '$15M Pier Plaza & Main Street Public Enhancement'
    }
  },

  // 5. LAGUNA BEACH (Official Municipal Government News)
  {
    id: 'gov-laguna-1',
    title: 'City of Laguna Beach Adopts Coastal Bluff Protection Ordinance & Downtown Promenade Expansion',
    subtitle: 'City Council approves permanent outdoor dining guidelines and strict environmental safeguards for coastal cliffs.',
    category: 'market-trends',
    cityName: 'Laguna Beach',
    publisher: 'City of Laguna Beach Government',
    publisherLogo: '🏛️',
    publishedAt: '5 hours ago',
    readTime: '4 min read',
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.lagunabeachcity.net/government/departments/community-development/planning-building',
    sourceCitation: 'City of Laguna Beach City Council Ordinance 2026-03 • Coastal Commission Local Coastal Program (LCP)',
    isBreaking: false,
    isFeatured: false,
    keyTakeaways: [
      'Laguna Beach City Council enacted comprehensive coastal bluff setback rules to prevent erosion along PCH.',
      'Made Forest Avenue Pedestrian Promenade a permanent municipal fixture with artisan flower boxes and live acoustic stages.',
      'Allocated $6M for public underground utility cabling to protect iconic ocean view corridors.'
    ],
    content: `The Laguna Beach City Council has officially enacted a dual ordinance aimed at preserving the city's oceanfront environment while cementing its reputation as a historic artists' haven.

Official municipal records highlight new geological survey requirements for cliffside construction, ensuring all residential estates maintain structural integrity without altering public beach access.

Simultaneously, the City finalized permanent status for the Promenade on Forest Avenue, allowing local galleries, boutique shops, and cafes to operate outdoor dining spaces in a pedestrian-only parklet setting.`,
    realEstateData: {
      neighborhood: 'Laguna Beach Coastal Bluffs & Village',
      priceRange: '$2,800,000 - $24,000,000',
      avgSqftPrice: '$2,250/sqft',
      trend: 'up',
      keyStat: 'Permanent Forest Ave Promenade'
    }
  },

  // 6. ANAHEIM (Official Municipal Government News)
  {
    id: 'gov-anaheim-1',
    title: 'City of Anaheim Approves $4B ocVIBE District Master Plan & Transit Connection',
    subtitle: 'Anaheim City Council ratifies development agreements for 95-acre entertainment hub around Honda Center and ARTIC.',
    category: 'city-developments',
    cityName: 'Anaheim',
    publisher: 'City of Anaheim Municipal Site',
    publisherLogo: '🏛️',
    publishedAt: '6 hours ago',
    readTime: '5 min read',
    heroImage: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.anaheim.net/ocvibe',
    sourceCitation: 'City of Anaheim City Council Resolution 2026-19 • Planning & Building Department Public Report',
    isBreaking: true,
    isFeatured: true,
    keyTakeaways: [
      'Anaheim City Council approved final entitlement permits for the $4 billion ocVIBE mixed-use district.',
      'Integrates 1,500 residential units, 35 restaurants, a 5,700-capacity concert hall, and 20 acres of public parks.',
      'Directly connects to ARTIC regional rail terminal and Santa Ana River bike trail network.'
    ],
    content: `In an official meeting streamed on the City of Anaheim's public site, the Anaheim City Council granted final approval for the ocVIBE master development agreement.

The 95-acre project surrounding the Honda Center creates a walkable urban center featuring public plazas, boutique hotels, market halls, and residential housing.

"ocVIBE represents one of the largest private infrastructure investments in Anaheim history," noted the Mayor of Anaheim. "It establishes a premier destination for entertainment, housing, and transit-oriented civic life."`,
    venueDetails: {
      name: 'ocVIBE District & Honda Center Plaza',
      type: 'development',
      address: '2695 E Katella Ave, Anaheim, CA 92806',
      highlight: '$4B Private Investment & Transit District'
    }
  },

  // 7. DANA POINT (Official Municipal Government News)
  {
    id: 'gov-dana-point-1',
    title: 'City of Dana Point Advances $500M Harbor Revitalization Phase 3 Groundbreaking',
    subtitle: 'Official City Manager update confirms commercial dock upgrades, boutique hotel plans, and new public slips.',
    category: 'city-developments',
    cityName: 'Dana Point',
    publisher: 'City of Dana Point Official Site',
    publisherLogo: '🏛️',
    publishedAt: '7 hours ago',
    readTime: '4 min read',
    heroImage: 'https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.danapoint.org/department/ocean-water-quality/harbor-revitalization',
    sourceCitation: 'City of Dana Point City Council Executive Summary • Dana Point Harbor Partners Quarterly Briefing',
    isBreaking: false,
    isFeatured: false,
    keyTakeaways: [
      'City of Dana Point published Phase 3 revitalization milestones for Dana Point Harbor.',
      'Replaces aging 1970s docks with 2,296 state-of-the-art marina boat slips.',
      'Constructs two waterfront hotels and a 120,000 sq ft retail dining boardwalk linked to the Lantern District.'
    ],
    content: `The City of Dana Point has issued an official progress briefing on the $500 million public-private partnership transforming Dana Point Harbor into a modern marine venue.

As detailed on the municipal site, construction teams are installing floating dock fingers, upgrading whale watching vessel docks, and laying foundation work for the new harbor dining village.

"Dana Point Harbor is the crown jewel of South Orange County," stated the City Manager. "This project balances modern boat slip amenities with public park access and classic coastal California charm."`,
    realEstateData: {
      neighborhood: 'Dana Point Harbor & Lantern District',
      priceRange: '$1,350,000 - $8,200,000',
      avgSqftPrice: '$1,080/sqft',
      trend: 'up',
      keyStat: '$500M Waterfront Modernization'
    }
  },

  // 8. SAN CLEMENTE (Official Municipal Government News)
  {
    id: 'gov-san-clemente-1',
    title: 'City of San Clemente Approves Pier Bowl Revitalization & Beach Trail Sand Replenishment',
    subtitle: 'City Council allocates municipal funds to protect historic Spanish Village architecture and coastal rail trail.',
    category: 'real-estate',
    cityName: 'San Clemente',
    publisher: 'City of San Clemente Official Site',
    publisherLogo: '🏛️',
    publishedAt: '8 hours ago',
    readTime: '4 min read',
    heroImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.san-clemente.org/government/city-departments/public-works/coastal-resiliency',
    sourceCitation: 'City of San Clemente City Council Resolution 2026-78 • Coastal Advisory Committee Minutes',
    isBreaking: false,
    isFeatured: false,
    keyTakeaways: [
      'San Clemente City Council approved $12M sand replenishment initiative in partnership with US Army Corps of Engineers.',
      'Preserves the scenic San Clemente Coastal Beach Trail running from North Beach to Calafia State Beach.',
      'Enacted historic preservation guidelines for Pier Bowl white stucco and red-tile roof commercial facades.'
    ],
    content: `Official municipal documentation published by the City of San Clemente confirms approval of the coastal sand nourishment project for San Clemente beaches.

The City Council authorized public works teams to deposit over 250,000 cubic yards of clean sand along the shoreline to protect the popular Pedestrian Beach Trail and rail corridor.

"San Clemente's identity as the 'Spanish Village by the Sea' relies on healthy beaches and historic preservation," noted San Clemente municipal leaders.`,
    realEstateData: {
      neighborhood: 'San Clemente Pier Bowl & Southwest Coast',
      priceRange: '$1,400,000 - $7,500,000',
      avgSqftPrice: '$980/sqft',
      trend: 'up',
      keyStat: 'Spanish Village Architectural Overlay'
    }
  },

  // 9. FULLERTON (Official Municipal Government News)
  {
    id: 'gov-fullerton-1',
    title: 'City of Fullerton Authorizes Downtown Historic Plaza & Commercial Street Corridor Enhancement',
    subtitle: 'Fullerton City Council allocates $8.5M for historic district sidewalk paving, lighting, and small business grants.',
    category: 'restaurants-bars',
    cityName: 'Fullerton',
    publisher: 'City of Fullerton Official Site',
    publisherLogo: '🏛️',
    publishedAt: '10 hours ago',
    readTime: '3 min read',
    heroImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.cityoffullerton.com/government/departments/community-economic-development',
    sourceCitation: 'City of Fullerton City Council Agenda Report 2026-34 • Downtown Redevelopment Agency',
    isBreaking: false,
    isFeatured: false,
    keyTakeaways: [
      'Fullerton City Council approved $8.5M infrastructure upgrades for the historic Downtown Fullerton Plaza.',
      'Expands outdoor patio dining permissions for local restaurants along Harbor Boulevard and Commonwealth Ave.',
      'Improves pedestrian safety lighting and parking structure accessibility near Cal State Fullerton corridor.'
    ],
    content: `The City Council of Fullerton has officially approved the Downtown District Enhancement Initiative, aimed at boosting economic vitality in historic downtown Fullerton.

As reported on the municipal site, the municipal investment funds decorative brick crosswalks, outdoor cafe seating expansions, and historic storefront restoration grants.

"Downtown Fullerton is renowned for its rich history, vibrant dining, and music culture," stated Fullerton economic development representatives.`,
    venueDetails: {
      name: 'Downtown Fullerton Historic Plaza',
      type: 'restaurant',
      address: '125 E Wilshire Ave, Fullerton, CA 92832',
      highlight: '$8.5M Historic District & Cafe Enhancement'
    }
  },

  // 10. ORANGE (Official Municipal Government News)
  {
    id: 'gov-orange-1',
    title: 'City of Orange Protects Historic Old Towne Plaza Circle & Approves Chapman University Campus Plan',
    subtitle: 'City Council ratifies landmark preservation rules for the iconic Orange Plaza Circle district.',
    category: 'market-trends',
    cityName: 'Orange',
    publisher: 'City of Orange Official Site',
    publisherLogo: '🏛️',
    publishedAt: '12 hours ago',
    readTime: '4 min read',
    heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.cityoforange.org/our-city/departments/community-development',
    sourceCitation: 'City of Orange Planning Commission Resolution 2026-15 • Old Towne Historic Design Standards',
    isBreaking: false,
    isFeatured: false,
    keyTakeaways: [
      'City of Orange enacted strict design guidelines for the 1-square-mile Old Towne Orange Historic District.',
      'Approved Chapman University’s campus expansion plan with dedicated student housing to relieve neighborhood parking.',
      'Preserves antique shops, historic brick dining facades, and the central Plaza park fountain.'
    ],
    content: `Official records from the City of Orange document the adoption of updated historic preservation standards for the famous Old Towne Orange Plaza Circle.

The City Council resolution ensures that all commercial renovations within the nation's largest National Register Historic District maintain 19th-century architectural integrity.

"Old Towne Orange represents the historic heart of Orange County," declared Orange municipal leaders.`,
    realEstateData: {
      neighborhood: 'Old Towne Orange Historic District',
      priceRange: '$850,000 - $2,400,000',
      avgSqftPrice: '$740/sqft',
      trend: 'stable',
      keyStat: 'National Historic District Landmark'
    }
  },

  // 11. MISSION VIEJO (Official Municipal Government News)
  {
    id: 'gov-mv-1',
    title: 'City of Mission Viejo Breaks Ground on Core City Center & Lakefront Recreation Plaza',
    subtitle: 'Official municipal report highlights $35M investment in walkable civic gathering spaces near La Paz Road.',
    category: 'city-developments',
    cityName: 'Mission Viejo',
    publisher: 'City of Mission Viejo Official Site',
    publisherLogo: '🏛️',
    publishedAt: '1 day ago',
    readTime: '4 min read',
    heroImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://cityofmissionviejo.org/departments/public-works/core-city-center',
    sourceCitation: 'City of Mission Viejo City Council Resolution 2026-52 • Department of Recreation & Community Services',
    isBreaking: false,
    isFeatured: false,
    keyTakeaways: [
      'Mission Viejo City Council approved construction contracts for the Core City Center Vision along Marguerite Pkwy.',
      'Creates a 5-acre civic plaza with outdoor dining, community garden amphitheater, and splash pad parks.',
      'Integrates public trails connecting directly to Lake Mission Viejo beaches and recreation docks.'
    ],
    content: `The City Council of Mission Viejo has authorized Phase 1 construction for the Core City Center project, as announced on the municipal site.

The initiative transforms city-owned land into a vibrant civic square with coffee shops, community pavilions, and open green space.

"Mission Viejo is celebrated for master-planned excellence," stated the Mission Viejo Mayor. "The Core City Center project creates a modern downtown hub for families and neighbors."`,
    venueDetails: {
      name: 'Mission Viejo Core City Center & Civic Plaza',
      type: 'development',
      address: '200 Civic Center, Mission Viejo, CA 92691',
      highlight: '$35M Lakefront Civic Plaza & Gathering Hub'
    }
  },

  // 12. LAKE FOREST (Official Municipal Government News)
  {
    id: 'gov-lf-1',
    title: 'City of Lake Forest Expands Sports Park & Approves Innovation Business Park Zoning',
    subtitle: 'City Council allocates funding for 86-acre Sports Park expansion and EV infrastructure.',
    category: 'city-developments',
    cityName: 'Lake Forest',
    publisher: 'City of Lake Forest Official Site',
    publisherLogo: '🏛️',
    publishedAt: '1 day ago',
    readTime: '3 min read',
    heroImage: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.lakeforestca.gov/en/departments/community-development',
    sourceCitation: 'City of Lake Forest City Council Agenda 2026-89 • Parks & Recreation Commission',
    isBreaking: false,
    isFeatured: false,
    keyTakeaways: [
      'Lake Forest City Council approved $10M addition to the Lake Forest Sports Park and Recreation Center.',
      'Adds lighted synthetic turf fields, pickleball courts, and native oak tree shade structures.',
      'Updated zoning for commercial technology parks along Towne Centre Drive.'
    ],
    content: `As published on the municipal site, the City Council of Lake Forest has approved expanding the Lake Forest Sports Park—one of Orange County's largest municipal recreation facilities.

The expansion introduces additional sports courts, expanded playground zones, and high-efficiency solar lighting for evening youth leagues.`,
    realEstateData: {
      neighborhood: 'Baker Ranch & Lake Forest Foothills',
      priceRange: '$950,000 - $2,600,000',
      avgSqftPrice: '$690/sqft',
      trend: 'up',
      keyStat: '86-Acre Municipal Sports Park'
    }
  },

  // 13. TUSTIN (Official Municipal Government News)
  {
    id: 'gov-tustin-1',
    title: 'City of Tustin Advances Tustin Legacy 1,600-Acre Master Plan & Innovation Park',
    subtitle: 'Tustin City Council approves new housing, central park trails, and regional tech campus entitlements.',
    category: 'city-developments',
    cityName: 'Tustin',
    publisher: 'City of Tustin Official Site',
    publisherLogo: '🏛️',
    publishedAt: '2 days ago',
    readTime: '4 min read',
    heroImage: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.tustinca.org/tustinlegacy',
    sourceCitation: 'City of Tustin City Council Ordinance 2026-14 • Tustin Legacy Community Development',
    isBreaking: false,
    isFeatured: false,
    keyTakeaways: [
      'Tustin City Council approved development rights for 800 new eco-friendly single-family homes and townhouses at Tustin Legacy.',
      'Expands Veterans Sports Park and the Tustin Legacy Central Park regional trail system.',
      'Connects the historic Tustin Hangar district to the District at Tustin Legacy shopping center.'
    ],
    content: `The City of Tustin has issued an official development update for Tustin Legacy on the municipal site. The 1,600-acre master-planned community on the site of the former Marine Corps Air Station continues its transformation into a model urban ecosystem with parks, housing, and bioscience commercial space.`,
    venueDetails: {
      name: 'Tustin Legacy Central Park & Civic Campus',
      type: 'development',
      address: '300 Centennial Way, Tustin, CA 92780',
      highlight: '1,600-Acre Urban Redevelopment Project'
    }
  },

  // 14. SAN JUAN CAPISTRANO (Official Municipal Government News)
  {
    id: 'gov-sjc-1',
    title: 'City of San Juan Capistrano Enhances Historic Mission District & Equestrian Open Space',
    subtitle: 'City Council approves downtown pedestrian streetscape improvements and farm corridor conservation easements.',
    category: 'market-trends',
    cityName: 'San Juan Capistrano',
    publisher: 'City of San Juan Capistrano Official Site',
    publisherLogo: '🏛️',
    publishedAt: '2 days ago',
    readTime: '4 min read',
    heroImage: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.sanjuancapistrano.org/departments/development-services',
    sourceCitation: 'City of San Juan Capistrano City Council Agenda Report 2026-41 • Cultural Resources Commission',
    isBreaking: false,
    isFeatured: false,
    keyTakeaways: [
      'San Juan Capistrano City Council approved historic preservation grants for Adobe homes near Mission San Juan Capistrano.',
      'Enacted permanent open space protections for agricultural land and equestrian trail networks along San Juan Creek.',
      'Enhanced pedestrian walkways linking Verdugo Street dining to the historic Train Depot.'
    ],
    content: `The City Council of San Juan Capistrano has adopted a comprehensive preservation plan for the city's downtown historic quarter. The resolution guarantees open space conservation for equestrian facilities while enhancing tourist access to the iconic 1776 Mission San Juan Capistrano.`,
    realEstateData: {
      neighborhood: 'Historic Downtown & Los Rios District',
      priceRange: '$1,150,000 - $5,800,000',
      avgSqftPrice: '$850/sqft',
      trend: 'up',
      keyStat: 'Historic 1776 Heritage Protection'
    }
  }
];
