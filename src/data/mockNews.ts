import { CityInfo, NewsArticle } from '../types';

export const CITIES: CityInfo[] = [
  {
    id: 'orange-county',
    name: 'Orange County',
    state: 'CA',
    avgSqftPrice: '$810 sqft',
    tagline: 'Countywide Metro News & Real Estate Trends',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'aliso-viejo',
    name: 'Aliso Viejo',
    state: 'CA',
    avgSqftPrice: '$720 sqft',
    tagline: 'Aliso Viejo Real Estate & Community Updates',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'anaheim',
    name: 'Anaheim',
    state: 'CA',
    avgSqftPrice: '$650 sqft',
    tagline: 'Anaheim Real Estate & Resort District Developments',
    image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'brea',
    name: 'Brea',
    state: 'CA',
    avgSqftPrice: '$640 sqft',
    tagline: 'Brea Real Estate & Downtown Commercial News',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'buena-park',
    name: 'Buena Park',
    state: 'CA',
    avgSqftPrice: '$610 sqft',
    tagline: 'Buena Park Entertainment & Residential Trends',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'costa-mesa',
    name: 'Costa Mesa',
    state: 'CA',
    avgSqftPrice: '$720 sqft',
    tagline: 'Costa Mesa Arts District & Housing Trends',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'cypress',
    name: 'Cypress',
    state: 'CA',
    avgSqftPrice: '$630 sqft',
    tagline: 'Cypress Housing & Corporate Parks',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'dana-point',
    name: 'Dana Point',
    state: 'CA',
    avgSqftPrice: '$1,080 sqft',
    tagline: 'Dana Point Harbor & Coastal Housing Trends',
    image: 'https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'fountain-valley',
    name: 'Fountain Valley',
    state: 'CA',
    avgSqftPrice: '$670 sqft',
    tagline: 'Fountain Valley Residential & Mile Square Park News',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'fullerton',
    name: 'Fullerton',
    state: 'CA',
    avgSqftPrice: '$680 sqft',
    tagline: 'Fullerton Historic Downtown & University Housing',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'garden-grove',
    name: 'Garden Grove',
    state: 'CA',
    avgSqftPrice: '$590 sqft',
    tagline: 'Garden Grove Town Center & Commercial Developments',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'huntington-beach',
    name: 'Huntington Beach',
    state: 'CA',
    avgSqftPrice: '$890 sqft',
    tagline: 'Huntington Beach Coastal Real Estate & Main St',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'irvine',
    name: 'Irvine',
    state: 'CA',
    avgSqftPrice: '$790 sqft',
    tagline: 'Irvine Great Park & Spectrum Housing Market',
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'la-habra',
    name: 'La Habra',
    state: 'CA',
    avgSqftPrice: '$580 sqft',
    tagline: 'La Habra Local Housing & Civic News',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'la-palma',
    name: 'La Palma',
    state: 'CA',
    avgSqftPrice: '$620 sqft',
    tagline: 'La Palma Residential Neighborhoods',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'laguna-beach',
    name: 'Laguna Beach',
    state: 'CA',
    avgSqftPrice: '$2,250 sqft',
    tagline: 'Laguna Beach Luxury Coastal Real Estate',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'laguna-hills',
    name: 'Laguna Hills',
    state: 'CA',
    avgSqftPrice: '$710 sqft',
    tagline: 'Laguna Hills Civic Center & Residential Market',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'laguna-niguel',
    name: 'Laguna Niguel',
    state: 'CA',
    avgSqftPrice: '$830 sqft',
    tagline: 'Laguna Niguel Master Planned Neighborhoods',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'laguna-woods',
    name: 'Laguna Woods',
    state: 'CA',
    avgSqftPrice: '$490 sqft',
    tagline: 'Laguna Woods Village & Active Living Housing',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'lake-forest',
    name: 'Lake Forest',
    state: 'CA',
    avgSqftPrice: '$690 sqft',
    tagline: 'Lake Forest Foothills & Sports Park Living',
    image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'los-alamitos',
    name: 'Los Alamitos',
    state: 'CA',
    avgSqftPrice: '$710 sqft',
    tagline: 'Los Alamitos Community & Race Course District',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'mission-viejo',
    name: 'Mission Viejo',
    state: 'CA',
    avgSqftPrice: '$690 sqft',
    tagline: 'Mission Viejo Lake & Civic Center Real Estate',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'newport-beach',
    name: 'Newport Beach',
    state: 'CA',
    avgSqftPrice: '$1,420 sqft',
    tagline: 'Newport Beach Harbor & Oceanfront Estates',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'orange',
    name: 'Orange',
    state: 'CA',
    avgSqftPrice: '$740 sqft',
    tagline: 'Old Towne Orange Plaza Preservation & Housing',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'placentia',
    name: 'Placentia',
    state: 'CA',
    avgSqftPrice: '$620 sqft',
    tagline: 'Placentia Town Center & Residential Neighborhoods',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'rancho-santa-margarita',
    name: 'Rancho Santa Margarita',
    state: 'CA',
    avgSqftPrice: '$670 sqft',
    tagline: 'Rancho Santa Margarita Lake & Foothills',
    image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'san-clemente',
    name: 'San Clemente',
    state: 'CA',
    avgSqftPrice: '$980 sqft',
    tagline: 'San Clemente Pier Bowl & Spanish Village Real Estate',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'san-juan-capistrano',
    name: 'San Juan Capistrano',
    state: 'CA',
    avgSqftPrice: '$850 sqft',
    tagline: 'San Juan Capistrano Historic Mission Estates',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'santa-ana',
    name: 'Santa Ana',
    state: 'CA',
    avgSqftPrice: '$580 sqft',
    tagline: 'Santa Ana Historic Downtown & Arts District',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'seal-beach',
    name: 'Seal Beach',
    state: 'CA',
    avgSqftPrice: '$920 sqft',
    tagline: 'Seal Beach Pier & Old Town Coastal Living',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'stanton',
    name: 'Stanton',
    state: 'CA',
    avgSqftPrice: '$560 sqft',
    tagline: 'Stanton Town Center & Housing Revitalization',
    image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'tustin',
    name: 'Tustin',
    state: 'CA',
    avgSqftPrice: '$740 sqft',
    tagline: 'Tustin Legacy & Historic Old Town Real Estate',
    image: 'https://images.unsplash.com/photo-1479839672679-a46483c0e7c8?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'villa-park',
    name: 'Villa Park',
    state: 'CA',
    avgSqftPrice: '$890 sqft',
    tagline: 'Villa Park Custom Estates & Equestrian Living',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'westminster',
    name: 'Westminster',
    state: 'CA',
    avgSqftPrice: '$600 sqft',
    tagline: 'Westminster Civic Center & Housing Market',
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'yorba-linda',
    name: 'Yorba Linda',
    state: 'CA',
    avgSqftPrice: '$710 sqft',
    tagline: 'Yorba Linda Foothill Estates & Trails',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  },
];

export const INITIAL_ARTICLES: NewsArticle[] = [
  // 0. MORTGAGE NEWS DAILY (MND) LIVE WIRE ARTICLES
  {
    id: 'news-mnd-live-featured-1',
    title: 'Mortgage Rates Hold Steady as Bond Markets Digest Federal Reserve & Inflation Data',
    subtitle: 'Conforming 30-year fixed rate indices hover near recent range as treasury yields stabilize amid fresh economic reports and housing demand.',
    category: 'mortgage-news',
    cityName: 'Daily Mortgage Market',
    publisher: 'Mortgage News Daily',
    publisherLogo: '📈',
    publishedAt: '1h ago',
    readTime: '4 min read',
    heroImage: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.mortgagenewsdaily.com',
    sourceCitation: 'Mortgage News Daily • Live Daily Market Wire',
    isBreaking: true,
    isFeatured: true,
    keyTakeaways: [
      'Mortgage News Daily Index monitors conforming 30-Year fixed rate movements daily across top US mortgage lenders.',
      'Bond market traders reacting to latest economic indicators, CPI trends, and Federal Reserve guidance.',
      'Borrowers locking in rates as purchase demand and refinance volume respond to day-to-day rate sheet shifts.'
    ],
    content: `Mortgage interest rates traded in a tight, disciplined range today as bond market volatility subsided following the latest economic data releases.\n\nAccording to the Mortgage News Daily rate survey, conforming 30-year fixed mortgages remain responsive to movements in 10-year Treasury yields and inflation expectations.\n\nFinancial market analysts and loan originators continue to monitor central bank guidance, employment statistics, and Treasury auction results for direction on upcoming rate moves. MND continues to provide transparent daily rate benchmarks for prospective homebuyers and refinancers.`
  },
  {
    id: 'news-mnd-live-wire-2',
    title: 'Understanding the 10-Year Treasury Yield Spread and Daily Lender Rate Sheets',
    subtitle: 'A breakdown of why mortgage interest rates move with benchmark bond yields and how loan originators price daily rate sheets for buyers.',
    category: 'mortgage-news',
    cityName: 'Daily Mortgage Market',
    publisher: 'Mortgage News Daily',
    publisherLogo: '📊',
    publishedAt: '3h ago',
    readTime: '5 min read',
    heroImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.mortgagenewsdaily.com',
    sourceCitation: 'Mortgage News Daily • Rate Watch Technical Analysis',
    isBreaking: false,
    isFeatured: false,
    keyTakeaways: [
      'Mortgage-Backed Securities (MBS) pricing directly influences lender rate sheet adjustments.',
      'The primary-secondary mortgage rate spread provides critical insight into originator capacity and market liquidity.',
      'Daily updates from MND provide market transparency for homebuyers comparing 30-year, 15-year, and Jumbo loan options.'
    ],
    content: `The relationship between 10-year Treasury yields and mortgage rates is one of the most closely watched barometers in real estate finance.\n\nWhile mortgage rates typically track long-term Treasury yields, the spread between them widens and narrows based on market liquidity, prepayment risk, and Federal Reserve balance sheet activity.\n\nToday's report examines current MBS coupon performance and offers tactical guidance for borrowers weighing floating vs. locking decisions in the current rate environment.`
  },
  {
    id: 'news-mnd-live-wire-3',
    title: 'MBS Market Overview: Mortgage-Backed Securities Steady Amid Steady Treasury Action',
    subtitle: 'Mortgage-backed bonds maintain support levels as originators report balanced purchase volume across regional markets.',
    category: 'mortgage-news',
    cityName: 'Daily Mortgage Market',
    publisher: 'Mortgage News Daily',
    publisherLogo: '🏦',
    publishedAt: '5h ago',
    readTime: '3 min read',
    heroImage: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.mortgagenewsdaily.com',
    sourceCitation: 'Mortgage News Daily • MBS Morning Report',
    isBreaking: false,
    isFeatured: false,
    keyTakeaways: [
      'Agency MBS prices trade within established weekly resistance channels.',
      'Lender pricing remains competitive with attractive pricing on conforming and FHA loan products.',
      'Technical indicators point to continued rangebound movement heading into upcoming FOMC meetings.'
    ],
    content: `Agency mortgage-backed securities held their ground in today's trading session, providing price stability for residential mortgage loan pricing across major wholesale and retail lenders.\n\nOriginators report steady pipeline flow from qualified buyers taking advantage of price adjustments in several major housing markets.`
  },
  // 1. ORANGE COUNTY HOUSING REPORT (The Condo Conundrum)
  {
    id: 'report-oc-condo-conundrum',
    title: 'The Condo Conundrum: Orange County Housing Market Report (August 3, 2026)',
    subtitle: 'Attached home inventory surges while detached single-family homes maintain momentum. Active listings reach 5,046 homes with 101 Days Expected Market Time.',
    category: 'real-estate',
    cityName: 'Orange County',
    publisher: 'Reports On Housing (Steven Thomas)',
    publisherLogo: '📊',
    publishedAt: 'Today at 09:00 AM',
    readTime: '6 min read',
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.reportsonhousing.com',
    sourceCitation: 'Reports On Housing Orange County Housing Report • August 3, 2026 Edition',
    isBreaking: true,
    isFeatured: true,
    keyTakeaways: [
      'Active listing inventory rose by 26 homes over the past two weeks to 5,046 active listings.',
      'Demand (30-day pending sales) increased 1% to 1,494 pending escrows.',
      'Expected market time countywide stands at 101 days (114 days for attached condos vs 93 days for detached).'
    ],
    content: `The Orange County housing market is adjusting to "The Condo Conundrum" as attached listing inventory surges while detached single-family homes maintain momentum across all 34 municipalities.

According to the latest official market report published on August 3, 2026 by Steven Thomas of Reports On Housing, active listing inventory increased by 26 homes over the past two weeks to reach 5,046 active listings.

Concurrently, 30-day demand—measured by new pending sales over the prior month—rose slightly to 1,494 pending escrows, marking the first increase in demand since early May.

With supply and demand nearly balanced, countywide Expected Market Time sits at 101 days.

Closed resales in the August report totaled 1,994 homes (+9% YoY) with a median sales price of $1,256,412 and a countywide 99.9% sales-to-list price ratio.`,
    realEstateData: {
      priceRange: '$1,300,000 Median',
      avgSqftPrice: '$590 sqft',
      neighborhood: 'Countywide Market Tiers',
      trend: 'stable',
      keyStat: '5,046 Active Listings • 101 Days Market Time'
    }
  },
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
  },

  // 15. ALISO VIEJO
  {
    id: 'gov-aliso-viejo-1',
    title: 'City of Aliso Viejo Expands Town Center Master Plan & Ridge Housing Trail Networks',
    subtitle: 'City Council approves modern residential parkside updates and Town Center retail enhancements.',
    category: 'city-developments',
    cityName: 'Aliso Viejo',
    publisher: 'City of Aliso Viejo Official Site',
    publisherLogo: '🏛️',
    publishedAt: 'Today',
    readTime: '4 min read',
    heroImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.cityofalisoviejo.com',
    sourceCitation: 'City of Aliso Viejo Planning Commission Report 2026-04',
    isBreaking: false,
    isFeatured: false,
    keyTakeaways: [
      'Aliso Viejo Town Center upgrades approved with walkable plazas and alfresco dining.',
      'Average home values reached $720/sqft with steady demand near Soka University.',
      'New wilderness trail access added to Aliso and Wood Canyons Wilderness Park.'
    ],
    content: `The City of Aliso Viejo has published a comprehensive master planning update for the Town Center commercial corridor. The project introduces enhanced pedestrian connections, electric vehicle charging hubs, and updated residential zoning around Soka University and Wood Canyons Wilderness Park.`,
    realEstateData: {
      neighborhood: 'Town Center & Ridge Communities',
      priceRange: '$850,000 - $2,100,000',
      avgSqftPrice: '$720/sqft',
      trend: 'up',
      keyStat: '100% Master-Planned Neighborhoods'
    }
  },

  // 16. BREA
  {
    id: 'gov-brea-1',
    title: 'City of Brea Unveils Downtown Commercial & Foothill Master Plan Enhancements',
    subtitle: 'City Council approves Brea Mall neighborhood expansion and Birch Street promenade upgrades.',
    category: 'real-estate',
    cityName: 'Brea',
    publisher: 'City of Brea Official Site',
    publisherLogo: '🏛️',
    publishedAt: 'Yesterday',
    readTime: '4 min read',
    heroImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.cityofbrea.net',
    sourceCitation: 'City of Brea City Council Ordinance 2026-08',
    isBreaking: false,
    isFeatured: false,
    keyTakeaways: [
      'Brea Mall redevelopment project adds luxury residential apartments and open-air dining.',
      'Foothill single-family luxury residences average $640/sqft.',
      'Birch Street Promenade receives expanded outdoor seating and art installations.'
    ],
    content: `Brea's City Council has greenlit major streetscape and mixed-use housing initiatives along Birch Street and Brea Mall. The new development combines upscale housing with accessible retail, reinforcing Brea's status as North Orange County's premier commercial hub.`,
    realEstateData: {
      neighborhood: 'Downtown Brea & Brea Hills',
      priceRange: '$780,000 - $1,950,000',
      avgSqftPrice: '$640/sqft',
      trend: 'up',
      keyStat: 'North OC Premier Shopping & Living'
    }
  },

  // 17. BUENA PARK
  {
    id: 'gov-buena-park-1',
    title: 'City of Buena Park Advances Beach Boulevard Entertainment District Master Plan',
    subtitle: 'New residential housing developments and promenade parks greenlit along Beach Blvd Corridor.',
    category: 'city-developments',
    cityName: 'Buena Park',
    publisher: 'City of Buena Park Official Site',
    publisherLogo: '🏛️',
    publishedAt: 'Yesterday',
    readTime: '3 min read',
    heroImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.buenapark.com',
    sourceCitation: 'City of Buena Park Redevelopment Plan 2026-11',
    isBreaking: false,
    isFeatured: false,
    keyTakeaways: [
      'Beach Blvd revitalized with modern townhouse communities and expanded dining options.',
      'Median home pricing steadily rising with average price at $610/sqft.',
      'Knott’s Berry Farm corridor enhances safety and pedestrian streetscapes.'
    ],
    content: `The City of Buena Park has approved major zoning adjustments along the Beach Boulevard Entertainment Zone. The initiative creates transit-oriented housing, green pedestrian corridors, and new commercial spaces for local businesses.`,
    realEstateData: {
      neighborhood: 'Beach Blvd Corridor & Los Coyotes',
      priceRange: '$650,000 - $1,400,000',
      avgSqftPrice: '$610/sqft',
      trend: 'up',
      keyStat: 'Entertainment Corridor Growth'
    }
  },

  // 18. CYPRESS
  {
    id: 'gov-cypress-1',
    title: 'City of Cypress Completes Katella Smart Park & Corporate Center Housing Initiative',
    subtitle: 'City Council approves modern residential infill project near Cypress College and corporate centers.',
    category: 'market-trends',
    cityName: 'Cypress',
    publisher: 'City of Cypress Official Site',
    publisherLogo: '🏛️',
    publishedAt: '2 days ago',
    readTime: '3 min read',
    heroImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.cypressca.org',
    sourceCitation: 'City of Cypress Housing Element 2026-03',
    isBreaking: false,
    isFeatured: false,
    keyTakeaways: [
      'New single-family and townhouse developments near Katella Avenue approved.',
      'Cypress housing market averages $630/sqft with high school district demand.',
      'Expanded green parkways and solar-powered street lighting installed.'
    ],
    content: `Cypress City Council has ratified an updated land use plan converting underutilized office footprint into modern, eco-friendly residential neighborhoods near Cypress College.`,
    realEstateData: {
      neighborhood: 'Katella District & Cypress College Corridor',
      priceRange: '$750,000 - $1,600,000',
      avgSqftPrice: '$630/sqft',
      trend: 'up',
      keyStat: 'Top-Rated Oxford Academy District'
    }
  },

  // 19. FOUNTAIN VALLEY
  {
    id: 'gov-fountain-valley-1',
    title: 'City of Fountain Valley Upgrades Mile Square Regional Park & Warner Avenue Master Plan',
    subtitle: 'New residential green housing and parkside pedestrian plazas approved by City Council.',
    category: 'city-developments',
    cityName: 'Fountain Valley',
    publisher: 'City of Fountain Valley Official Site',
    publisherLogo: '🏛️',
    publishedAt: 'Today',
    readTime: '4 min read',
    heroImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.fountainvalley.org',
    sourceCitation: 'City of Fountain Valley Community Development Report 2026-02',
    isBreaking: false,
    isFeatured: false,
    keyTakeaways: [
      'Mile Square Park adjacent residential communities see steady demand at $670/sqft.',
      'Warner Avenue corridor receives updated bike lanes and parkside landscaping.',
      'Civic Center upgrades include solar canopy installations and EV charging parks.'
    ],
    content: `Fountain Valley municipal leaders have announced major infrastructure enhancements surrounding Mile Square Regional Park. The initiative aligns green park preservation with modern single-family housing upgrades.`,
    realEstateData: {
      neighborhood: 'Mile Square Park & Warner Corridor',
      priceRange: '$820,000 - $1,800,000',
      avgSqftPrice: '$670/sqft',
      trend: 'up',
      keyStat: 'Mile Square Park Green Living'
    }
  },

  // 20. GARDEN GROVE
  {
    id: 'gov-garden-grove-1',
    title: 'City of Garden Grove Breaks Ground on Brookhurst Street Mixed-Use District',
    subtitle: 'City Council approves modern housing and Little Saigon commercial promenade improvements.',
    category: 'real-estate',
    cityName: 'Garden Grove',
    publisher: 'City of Garden Grove Official Site',
    publisherLogo: '🏛️',
    publishedAt: 'Yesterday',
    readTime: '4 min read',
    heroImage: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.ggcity.org',
    sourceCitation: 'City of Garden Grove Economic Development Report 2026-07',
    isBreaking: false,
    isFeatured: false,
    keyTakeaways: [
      'Brookhurst Street commercial zone expanded with modern multi-family and retail housing.',
      'Average home prices at $590/sqft drawing strong first-time buyer demand.',
      'Historic Main Street pedestrian square receives tree canopy and fountain enhancements.'
    ],
    content: `Garden Grove's City Council has officially initiated the Brookhurst Corridor Improvement Project. The development delivers updated townhomes, green plazas, and updated storefronts near Historic Main Street.`,
    realEstateData: {
      neighborhood: 'Brookhurst Corridor & Historic Main St',
      priceRange: '$620,000 - $1,350,000',
      avgSqftPrice: '$590/sqft',
      trend: 'up',
      keyStat: 'Transit-Oriented Town Center'
    }
  },

  // 21. LA HABRA
  {
    id: 'gov-la-habra-1',
    title: 'City of La Habra Enhances La Habra Boulevard Historic & Residential District',
    subtitle: 'City Council approves Westridge residential enhancements and civic park upgrades.',
    category: 'market-trends',
    cityName: 'La Habra',
    publisher: 'City of La Habra Official Site',
    publisherLogo: '🏛️',
    publishedAt: '3 days ago',
    readTime: '3 min read',
    heroImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.lahabraca.gov',
    sourceCitation: 'City of La Habra General Plan Update 2026-05',
    isBreaking: false,
    isFeatured: false,
    keyTakeaways: [
      'La Habra Westridge area housing demand strong with median pricing at $580/sqft.',
      'La Habra Blvd streetscape revitalized with historic lighting and native landscaping.',
      'New community park and youth athletics facility greenlit.'
    ],
    content: `The City of La Habra has approved a revitalized master plan for the La Habra Boulevard corridor. The initiative includes historic neighborhood preservation, modern single-family home upgrades, and expanded community park spaces.`,
    realEstateData: {
      neighborhood: 'Westridge & La Habra Hills',
      priceRange: '$630,000 - $1,450,000',
      avgSqftPrice: '$580/sqft',
      trend: 'up',
      keyStat: 'Family-Centric Foothill Living'
    }
  },

  // 22. LA PALMA
  {
    id: 'gov-la-palma-1',
    title: 'City of La Palma Celebrates Top Safety Rating & Residential Park Renewal',
    subtitle: 'City Council approves Central Park enhancements and tree-lined neighborhood streetscapes.',
    category: 'city-developments',
    cityName: 'La Palma',
    publisher: 'City of La Palma Official Site',
    publisherLogo: '🏛️',
    publishedAt: '2 days ago',
    readTime: '3 min read',
    heroImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.cityoflapalma.org',
    sourceCitation: 'City of La Palma Annual Civic Progress Report 2026-01',
    isBreaking: false,
    isFeatured: false,
    keyTakeaways: [
      'La Palma ranked among safest cities in California with high community stability.',
      'Average home pricing holding strong at $620/sqft.',
      'La Palma Central Park upgrades feature new tennis courts and solar walking trails.'
    ],
    content: `La Palma municipal officials have released the annual civic report highlighting neighborhood preservation and safety metrics. Central Park improvements and updated street lighting lead the city's residential investment initiatives.`,
    realEstateData: {
      neighborhood: 'Central La Palma & Walker Corridor',
      priceRange: '$720,000 - $1,300,000',
      avgSqftPrice: '$620/sqft',
      trend: 'stable',
      keyStat: 'Top-Ranked Safe Community'
    }
  },

  // 23. LAGUNA HILLS
  {
    id: 'gov-laguna-hills-1',
    title: 'City of Laguna Hills Approves Community Center & Ridge Housing Upgrades',
    subtitle: 'City Council greenlights Moulton Parkway residential improvements and parkland preservation.',
    category: 'real-estate',
    cityName: 'Laguna Hills',
    publisher: 'City of Laguna Hills Official Site',
    publisherLogo: '🏛️',
    publishedAt: 'Yesterday',
    readTime: '4 min read',
    heroImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.lagunahillsca.gov',
    sourceCitation: 'City of Laguna Hills Council Report 2026-06',
    isBreaking: false,
    isFeatured: false,
    keyTakeaways: [
      'Moulton Parkway residential homes holding average price of $710/sqft.',
      'Laguna Hills Community Center grounds expand with new pickleball courts and gardens.',
      'Equestrian trails along Nellie Gail Ranch preserved in open space easement.'
    ],
    content: `The City Council of Laguna Hills has approved a comprehensive parkland and housing improvement plan. Highlights include updated equestrian trail maintenance, solar energy incentive programs for homeowners, and Moulton Parkway landscaping.`,
    realEstateData: {
      neighborhood: 'Nellie Gail Ranch & Moulton Corridor',
      priceRange: '$880,000 - $3,200,000',
      avgSqftPrice: '$710/sqft',
      trend: 'up',
      keyStat: 'Luxury Equestrian & Estate Homes'
    }
  },
  {
    id: 'gov-laguna-hills-2',
    title: 'City of Laguna Hills Approves Mall Village Redevelopment & Civic Tech Park',
    subtitle: 'City Council greenlights mixed-use residential village with open-air plaza and innovation hub.',
    category: 'city-developments',
    cityName: 'Laguna Hills',
    publisher: 'City of Laguna Hills Official Site',
    publisherLogo: '🏛️',
    publishedAt: 'Today',
    readTime: '4 min read',
    heroImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.lagunahillsca.gov',
    sourceCitation: 'City of Laguna Hills Planning Commission Ordinance 2026-12',
    isBreaking: true,
    isFeatured: true,
    keyTakeaways: [
      'Laguna Hills Mall site transformation into walkable village with 600 residential homes.',
      'Includes 15-acre public central park, alfresco dining, and community tech hub.',
      'Projected to generate over 1,200 local construction and retail jobs.'
    ],
    content: `The City of Laguna Hills has officially approved the Master Revitalization Plan for the former Laguna Hills Mall site. The project creates a vibrant, walkable mixed-use village featuring high-end residential apartments, boutique retail, alfresco dining, and a state-of-the-art tech incubator hub.`,
    realEstateData: {
      neighborhood: 'Laguna Hills Center & Calle de la Magdalena',
      priceRange: '$750,000 - $2,200,000',
      avgSqftPrice: '$725/sqft',
      trend: 'up',
      keyStat: 'Major Village Master Plan Approval'
    }
  },
  {
    id: 'dining-laguna-hills-1',
    title: 'Boutique Tuscan Trattoria and Artisanal Café Open in Laguna Hills Plaza',
    subtitle: 'Acclaimed chefs bring authentic wood-fired pizzas, handmade pasta, and espresso bar to Moulton Pkwy.',
    category: 'restaurants-bars',
    cityName: 'Laguna Hills',
    publisher: 'OC Food & Wine Journal',
    publisherLogo: '🍷',
    publishedAt: '2 days ago',
    readTime: '3 min read',
    heroImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.lagunahillsca.gov',
    sourceCitation: 'OC Dining & Hospitality Gazette',
    isBreaking: false,
    isFeatured: false,
    keyTakeaways: [
      'Osteria Bella Vista features importing Italian wood-fired ovens and organic flour.',
      'Features an expansive outdoor heated patio facing the Saddleback Mountains.',
      'Breakfast espresso lounge opens daily at 6:30 AM.'
    ],
    content: `Food enthusiasts in South Orange County have a new dining destination as Osteria Bella Vista opens its doors on Moulton Parkway in Laguna Hills. Offering hand-rolled pasta, wood-fired Neapolitan pizzas, and a curating list of Italian wines.`,
    venueDetails: {
      name: 'Osteria Bella Vista',
      type: 'restaurant',
      address: '24300 Moulton Pkwy, Laguna Hills, CA 92653',
      highlight: 'Handmade Pasta & Wood-Fired Tuscan Dining'
    }
  },

  // 24. LAGUNA NIGUEL
  {
    id: 'gov-laguna-niguel-1',
    title: 'City of Laguna Niguel Expands Town Center Master Plan & Crown Valley Corridor',
    subtitle: 'City Council approves modern civic plaza, luxury single-family homes, and trail connections.',
    category: 'city-developments',
    cityName: 'Laguna Niguel',
    publisher: 'City of Laguna Niguel Official Site',
    publisherLogo: '🏛️',
    publishedAt: 'Today',
    readTime: '4 min read',
    heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.cityoflagunaniguel.org',
    sourceCitation: 'City of Laguna Niguel Town Center Master Plan 2026-09',
    isBreaking: false,
    isFeatured: false,
    keyTakeaways: [
      'Laguna Niguel Town Center breaking ground with outdoor plazas and boutique dining.',
      'Average luxury single-family homes pricing at $830/sqft.',
      'Crown Valley Community Park trail link to Salt Creek Beach enhanced.'
    ],
    content: `Laguna Niguel municipal leadership has finalized entitlements for the Town Center redevelopment. The project introduces walkable suburban living, outdoor dining, and direct trail access connecting to the coastal ridge.`,
    realEstateData: {
      neighborhood: 'Bear Brand & Crown Valley',
      priceRange: '$1,100,000 - $4,200,000',
      avgSqftPrice: '$830/sqft',
      trend: 'up',
      keyStat: 'Master-Planned Coastal Foothills'
    }
  },

  // 25. LAGUNA WOODS
  {
    id: 'gov-laguna-woods-1',
    title: 'City of Laguna Woods Modernizes Active Living Housing & Community Amenities',
    subtitle: 'City Council and Village leadership launch green energy retrofits and shuttle service upgrades.',
    category: 'market-trends',
    cityName: 'Laguna Woods',
    publisher: 'City of Laguna Woods Official Site',
    publisherLogo: '🏛️',
    publishedAt: '2 days ago',
    readTime: '3 min read',
    heroImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.cityoflagunawoods.org',
    sourceCitation: 'City of Laguna Woods Senior Housing Progress Report 2026-02',
    isBreaking: false,
    isFeatured: false,
    keyTakeaways: [
      'Laguna Woods Village home pricing averages accessible $490/sqft.',
      'New electric shuttle fleet deployed across all community gates.',
      'Solar roofing retrofits and golf course water recycling facilities completed.'
    ],
    content: `The City of Laguna Woods has partnered with community leaders to deliver comprehensive sustainability retrofits. Solar power installations and EV transport upgrades position Laguna Woods as a premier active adult community.`,
    realEstateData: {
      neighborhood: 'Laguna Woods Village',
      priceRange: '$350,000 - $950,000',
      avgSqftPrice: '$490/sqft',
      trend: 'stable',
      keyStat: 'Premier Active Adult Living'
    }
  },

  // 26. LOS ALAMITOS
  {
    id: 'gov-los-alamitos-1',
    title: 'City of Los Alamitos Enhances Katella Downtown Promenade & Joint Forces Training Base Corridor',
    subtitle: 'City Council approves streetscape improvements and civic park improvements.',
    category: 'city-developments',
    cityName: 'Los Alamitos',
    publisher: 'City of Los Alamitos Official Site',
    publisherLogo: '🏛️',
    publishedAt: 'Yesterday',
    readTime: '3 min read',
    heroImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.cityoflosalamitos.org',
    sourceCitation: 'City of Los Alamitos Downtown Vision Plan 2026-03',
    isBreaking: false,
    isFeatured: false,
    keyTakeaways: [
      'Katella Avenue corridor upgraded with wider sidewalks and oak shade trees.',
      'Average home pricing holding strong at $710/sqft with top school district demand.',
      'Los Alamitos Race Course adjacent district master plan underway.'
    ],
    content: `The City Council of Los Alamitos has adopted the Katella Corridor Pedestrian Master Plan. The project enhances downtown retail connectivity while preserving the town's close-knit residential charm.`,
    realEstateData: {
      neighborhood: 'Katella District & Suburbia Estates',
      priceRange: '$880,000 - $1,900,000',
      avgSqftPrice: '$710/sqft',
      trend: 'up',
      keyStat: 'Top School District Demand'
    }
  },

  // 27. PLACENTIA
  {
    id: 'gov-placentia-1',
    title: 'City of Placentia Opens New Metrolink Transit District & Old Town Housing',
    subtitle: 'City Council approves modern transit-oriented village with cafes and pedestrian plazas.',
    category: 'real-estate',
    cityName: 'Placentia',
    publisher: 'City of Placentia Official Site',
    publisherLogo: '🏛️',
    publishedAt: 'Today',
    readTime: '4 min read',
    heroImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.placentia.org',
    sourceCitation: 'City of Placentia Transit District Ordinance 2026-10',
    isBreaking: false,
    isFeatured: false,
    keyTakeaways: [
      'Placentia Metrolink Transit District features 400 new luxury residential units.',
      'Average home prices at $620/sqft attracting commuters to LA and Orange County hubs.',
      'Old Town Placentia revitalized with brick plazas and local craft breweries.'
    ],
    content: `Placentia's transit-oriented development plan has reached key construction milestones. The project combines passenger rail access with high-density modern housing and historic Old Town pedestrian plazas.`,
    realEstateData: {
      neighborhood: 'Old Town Placentia & Transit Village',
      priceRange: '$680,000 - $1,400,000',
      avgSqftPrice: '$620/sqft',
      trend: 'up',
      keyStat: 'Transit-Oriented Rail Access'
    }
  },

  // 28. RANCHO SANTA MARGARITA
  {
    id: 'gov-rsm-1',
    title: 'City of Rancho Santa Margarita Upgrades RSM Lake Park & Foothill Town Center',
    subtitle: 'City Council approves lakefront promenade lighting, sports park enhancements, and home retrofits.',
    category: 'city-developments',
    cityName: 'Rancho Santa Margarita',
    publisher: 'City of Rancho Santa Margarita Official Site',
    publisherLogo: '🏛️',
    publishedAt: '2 days ago',
    readTime: '3 min read',
    heroImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.cityofrsm.org',
    sourceCitation: 'City of RSM Master Plan Review 2026-04',
    isBreaking: false,
    isFeatured: false,
    keyTakeaways: [
      'Rancho Santa Margarita Lake path enhanced with LED lights and water features.',
      'Foothill single-family homes averaging $670/sqft with high buyer demand.',
      'Saddleback Valley views and hiking trail amenities expanded.'
    ],
    content: `Rancho Santa Margarita municipal leaders have announced improvements to the RSM Lakefront Park and Town Center promenade. The community remains one of OC's most desirable master-planned foothill destinations.`,
    realEstateData: {
      neighborhood: 'RSM Lakefront & Foothill Ranch',
      priceRange: '$750,000 - $1,750,000',
      avgSqftPrice: '$670/sqft',
      trend: 'up',
      keyStat: 'Saddleback Foothill Views'
    }
  },

  // 29. SANTA ANA
  {
    id: 'gov-santa-ana-1',
    title: 'City of Santa Ana Advances Downtown Historic Arts District Master Plan',
    subtitle: 'City Council approves modern urban housing infill and OC Streetcar transit corridor.',
    category: 'city-developments',
    cityName: 'Santa Ana',
    publisher: 'City of Santa Ana Official Site',
    publisherLogo: '🏛️',
    publishedAt: 'Today',
    readTime: '4 min read',
    heroImage: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.santa-ana.org',
    sourceCitation: 'City of Santa Ana Downtown Strategic Plan 2026-12',
    isBreaking: false,
    isFeatured: false,
    keyTakeaways: [
      'OC Streetcar transit corridor nearing full commercial operation in Downtown Santa Ana.',
      'Average home pricing holding at $580/sqft with historic Floral Park homes commanding premium.',
      '4th Street Artists Village receives expanded patio dining permissions.'
    ],
    content: `Santa Ana's City Council has ratified the latest phase of the Downtown Arts District revitalization. The project integrates transit line access with loft housing, historic restoration, and local dining hubs.`,
    realEstateData: {
      neighborhood: 'Downtown Arts District & Floral Park',
      priceRange: '$580,000 - $1,650,000',
      avgSqftPrice: '$580/sqft',
      trend: 'up',
      keyStat: 'Historic Architecture & Streetcar'
    }
  },

  // 30. SEAL BEACH
  {
    id: 'gov-seal-beach-1',
    title: 'City of Seal Beach Restores Historic Wooden Pier & Main Street Coastal Quarter',
    subtitle: 'City Council approves beach preservation funding and historic downtown lighting.',
    category: 'real-estate',
    cityName: 'Seal Beach',
    publisher: 'City of Seal Beach Official Site',
    publisherLogo: '🏛️',
    publishedAt: 'Yesterday',
    readTime: '4 min read',
    heroImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.sealbeachca.gov',
    sourceCitation: 'City of Seal Beach Coastal Resources Report 2026-02',
    isBreaking: false,
    isFeatured: false,
    keyTakeaways: [
      'Seal Beach wooden pier structure retrofitted with eco-friendly timber and ocean view seating.',
      'Coastal single-family homes averaging $920/sqft with high oceanfront demand.',
      'Main Street historic shops receive updated brick sidewalks and landscaping.'
    ],
    content: `The City of Seal Beach has approved a capital improvement grant for the historic 1,835-foot Seal Beach Pier and Main Street promenade. The coastal community maintains its coveted small-town beach vibe.`,
    realEstateData: {
      neighborhood: 'Old Town Seal Beach & Hill Cove',
      priceRange: '$1,200,000 - $4,800,000',
      avgSqftPrice: '$920/sqft',
      trend: 'up',
      keyStat: 'Small-Town Coastal Charm'
    }
  },

  // 31. STANTON
  {
    id: 'gov-stanton-1',
    title: 'City of Stanton Launches Town Center Plaza & Beach Blvd Infill Housing Project',
    subtitle: 'City Council approves modern residential parkside units and commercial redevelopment.',
    category: 'city-developments',
    cityName: 'Stanton',
    publisher: 'City of Stanton Official Site',
    publisherLogo: '🏛️',
    publishedAt: '3 days ago',
    readTime: '3 min read',
    heroImage: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.ci.stanton.ca.us',
    sourceCitation: 'City of Stanton Urban Renewal Plan 2026-05',
    isBreaking: false,
    isFeatured: false,
    keyTakeaways: [
      'Stanton Central Park adjacent housing developments added with modern family townhomes.',
      'Average home pricing at $560/sqft with high investment growth.',
      'Beach Blvd corridor features new outdoor dining court and community park.'
    ],
    content: `Stanton municipal leadership has greenlit the Beach Boulevard Commercial Revitalization Project. The initiative delivers new affordable and market-rate housing options alongside green public plazas.`,
    realEstateData: {
      neighborhood: 'Stanton Central & Beach Corridor',
      priceRange: '$550,000 - $1,150,000',
      avgSqftPrice: '$560/sqft',
      trend: 'up',
      keyStat: 'Infill Renewal Project'
    }
  },

  // 32. VILLA PARK
  {
    id: 'gov-villa-park-1',
    title: 'City of Villa Park Preserves Custom Estate Zoning & Santiago Creek Open Space',
    subtitle: 'City Council affirms low-density custom estate guidelines and equestrian trail maintenance.',
    category: 'market-trends',
    cityName: 'Villa Park',
    publisher: 'City of Villa Park Official Site',
    publisherLogo: '🏛️',
    publishedAt: '2 days ago',
    readTime: '3 min read',
    heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.villapark.org',
    sourceCitation: 'City of Villa Park Planning Commission Resolution 2026-01',
    isBreaking: false,
    isFeatured: false,
    keyTakeaways: [
      'Villa Park custom estate homes average $890/sqft with half-acre minimum lot sizes.',
      'Town Center shopping plaza upgraded with new boutique grocery and pharmacy.',
      'Santiago Creek greenbelt trail protection ordinance unanimously extended.'
    ],
    content: `The City Council of Villa Park has reaffirmed its commitment to maintaining low-density estate residential zoning. Villa Park, Orange County's smallest city, continues to offer half-acre lot custom homes and equestrian lifestyle features.`,
    realEstateData: {
      neighborhood: 'Villa Park Custom Estates',
      priceRange: '$1,850,000 - $5,500,000',
      avgSqftPrice: '$890/sqft',
      trend: 'up',
      keyStat: 'Half-Acre Minimum Custom Estates'
    }
  },

  // 33. WESTMINSTER
  {
    id: 'gov-westminster-1',
    title: 'City of Westminster Approves Civic Center Redevelopment & Little Saigon Plaza Plan',
    subtitle: 'City Council approves modern multi-family housing, public amphitheater, and green park.',
    category: 'city-developments',
    cityName: 'Westminster',
    publisher: 'City of Westminster Official Site',
    publisherLogo: '🏛️',
    publishedAt: 'Yesterday',
    readTime: '4 min read',
    heroImage: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.westminster-ca.gov',
    sourceCitation: 'City of Westminster Civic Master Plan 2026-08',
    isBreaking: false,
    isFeatured: false,
    keyTakeaways: [
      'Westminster Civic Center master plan includes 500 new residential units and civic hall.',
      'Average home pricing holding at $600/sqft.',
      'Bolsa Avenue Little Saigon cultural corridor enhancements approved.'
    ],
    content: `Westminster's City Council has approved final designs for the Civic Center Revitalization Master Plan. The project brings modern parkside housing, an outdoor performance plaza, and upgraded municipal services.`,
    realEstateData: {
      neighborhood: 'Civic Center & Little Saigon District',
      priceRange: '$650,000 - $1,450,000',
      avgSqftPrice: '$600/sqft',
      trend: 'up',
      keyStat: 'Civic Center Renewal'
    }
  },

  // 34. YORBA LINDA
  {
    id: 'gov-yorba-linda-1',
    title: 'City of Yorba Linda Expands Town Center & Equestrian Trail Preservation',
    subtitle: 'City Council approves single-family foothill developments and Main Street park enhancements.',
    category: 'real-estate',
    cityName: 'Yorba Linda',
    publisher: 'City of Yorba Linda Official Site',
    publisherLogo: '🏛️',
    publishedAt: 'Today',
    readTime: '4 min read',
    heroImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    sourceUrl: 'https://www.yorbalindaca.gov',
    sourceCitation: 'City of Yorba Linda Foothill Plan 2026-11',
    isBreaking: false,
    isFeatured: false,
    keyTakeaways: [
      'Yorba Linda Town Center promenade features new dining options and outdoor cinema lawn.',
      'Foothill luxury single-family homes averaging $710/sqft.',
      'Over 100 miles of equestrian and hiking trails protected in open space trust.'
    ],
    content: `The City of Yorba Linda has announced master plan updates for the Yorba Linda Town Center and foothill residential developments. Known as the "Land of Gracious Living," Yorba Linda continues to expand parks and trails while offering premier estate homes.`,
    realEstateData: {
      neighborhood: 'Yorba Linda Town Center & East Lake',
      priceRange: '$1,050,000 - $3,800,000',
      avgSqftPrice: '$710/sqft',
      trend: 'up',
      keyStat: '100+ Miles Equestrian Trails'
    }
  }
];
