export interface LocationData {
  countries: string[];
  statesProvinces: Record<string, string[]>;
  cities: Record<string, string[]>;
}

export class LocationHelper {
  public static COUNTRIES = ['United States', 'Canada'];

  public static STATES_PROVINCES: Record<string, string[]> = {
    'United States': [
      'California',
      'New York',
      'Texas',
      'Florida',
      'Illinois',
      'Washington',
      'Massachusetts',
      'Georgia',
      'Colorado',
      'Pennsylvania'
    ],
    'Canada': [
      'Ontario',
      'British Columbia',
      'Alberta',
      'Quebec',
      'Nova Scotia',
      'Manitoba',
      'Saskatchewan'
    ]
  };

  public static CITIES: Record<string, string[]> = {
    // California
    'California': [
      'Los Angeles',
      'San Francisco',
      'San Diego',
      'San Jose',
      'Sacramento',
      'Fresno',
      'Long Beach',
      'Oakland',
      'Bakersfield',
      'Anaheim',
      'Santa Ana',
      'Riverside',
      'Irvine',
      'Stockton'
    ],
    // New York
    'New York': [
      'New York City',
      'Buffalo',
      'Rochester',
      'Yonkers',
      'Syracuse',
      'Albany',
      'New Rochelle',
      'Mount Vernon',
      'Utica',
      'Schenectady',
      'White Plains'
    ],
    // Texas
    'Texas': [
      'Houston',
      'San Antonio',
      'Dallas',
      'Austin',
      'Fort Worth',
      'El Paso',
      'Arlington',
      'Corpus Christi',
      'Plano',
      'Lubbock',
      'Irving',
      'Garland'
    ],
    // Florida
    'Florida': [
      'Miami',
      'Orlando',
      'Tampa',
      'Jacksonville',
      'St. Petersburg',
      'Hialeah',
      'Port St. Lucie',
      'Cape Coral',
      'Tallahassee',
      'Fort Lauderdale'
    ],
    // Illinois
    'Illinois': [
      'Chicago',
      'Aurora',
      'Joliet',
      'Naperville',
      'Rockford',
      'Elgin',
      'Springfield',
      'Peoria',
      'Champaign',
      'Waukegan'
    ],
    // Washington
    'Washington': [
      'Seattle',
      'Spokane',
      'Tacoma',
      'Vancouver',
      'Bellevue',
      'Kent',
      'Everett',
      'Renton',
      'Yakima',
      'Federal Way'
    ],
    // Massachusetts
    'Massachusetts': [
      'Boston',
      'Worcester',
      'Springfield',
      'Cambridge',
      'Lowell',
      'Brockton',
      'Quincy',
      'Lynn',
      'New Bedford',
      'Fall River'
    ],
    // Georgia
    'Georgia': [
      'Atlanta',
      'Augusta',
      'Columbus',
      'Macon',
      'Savannah',
      'Athens',
      'Sandy Springs',
      'Roswell',
      'Johns Creek',
      'Warner Robins'
    ],
    // Colorado
    'Colorado': [
      'Denver',
      'Colorado Springs',
      'Aurora',
      'Fort Collins',
      'Lakewood',
      'Thornton',
      'Arvada',
      'Westminster',
      'Pueblo',
      'Greeley'
    ],
    // Pennsylvania
    'Pennsylvania': [
      'Philadelphia',
      'Pittsburgh',
      'Allentown',
      'Reading',
      'Erie',
      'Scranton',
      'Bethlehem',
      'Lancaster',
      'Harrisburg',
      'Altoona'
    ],

    // --- CANADA ---
    // Ontario
    'Ontario': [
      'Toronto',
      'Ottawa',
      'Mississauga',
      'Brampton',
      'Hamilton',
      'London',
      'Markham',
      'Vaughan',
      'Kitchener',
      'Windsor',
      'Richmond Hill',
      'Oakville',
      'Burlington'
    ],
    // British Columbia
    'British Columbia': [
      'Vancouver',
      'Surrey',
      'Burnaby',
      'Richmond',
      'Abbotsford',
      'Coquitlam',
      'Kelowna',
      'Victoria',
      'Saanich',
      'Kamloops',
      'Nanaimo'
    ],
    // Alberta
    'Alberta': [
      'Calgary',
      'Edmonton',
      'Red Deer',
      'Lethbridge',
      'St. Albert',
      'Medicine Hat',
      'Grande Prairie',
      'Airdrie',
      'Spruce Grove'
    ],
    // Quebec
    'Quebec': [
      'Montreal',
      'Quebec City',
      'Laval',
      'Gatineau',
      'Longueuil',
      'Sherbrooke',
      'Saguenay',
      'Levis',
      'Trois-Rivieres',
      'Terrebonne'
    ],
    // Nova Scotia
    'Nova Scotia': [
      'Halifax',
      'Sydney',
      'Dartmouth',
      'Truro',
      'New Glasgow',
      'Glace Bay',
      'Kentville',
      'Amherst'
    ],
    // Manitoba
    'Manitoba': [
      'Winnipeg',
      'Brandon',
      'Steinbach',
      'Thompson',
      'Portage la Prairie',
      'Winkler',
      'Selkirk'
    ],
    // Saskatchewan
    'Saskatchewan': [
      'Saskatoon',
      'Regina',
      'Prince Albert',
      'Moose Jaw',
      'Swift Current',
      'Yorkton',
      'North Battleford'
    ]
  };
}
