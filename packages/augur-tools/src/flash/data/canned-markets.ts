import { formatBytes32String } from 'ethers/utils';
import {
  today,
  thisYear,
  inOneMonths,
  inTwoMonths,
  inThreeMonths,
  inFiveMonths,
  inSixMonths,
  inTenMonths,
  midnightTomorrow,
} from '../time';
import moment from 'moment';
import {
  TEMPLATES,
  POLITICS,
  US_POLITICS,
  Template,
  REQUIRED,
  FINANCE,
  INDEXES,
  AMERICAN_FOOTBALL,
  SPORTS,
  NFL,
  SOCCER,
  MENS_LEAGUES,
  GOLF,
  PGA,
  CRYPTO,
  ETHEREUM,
  BASKETBALL,
  NBA,
  NFL_DRAFT,
} from '@augurproject/artifacts';

interface AskBid {
  shares: string;
  price: string;
}

interface BuySell {
  buy: AskBid[];
  sell: AskBid[];
}

export interface OrderBook {
  [outcome: string]: BuySell;
}

export const singleOutcomeAsks: AskBid[] = [
  { shares: '100.00', price: '0.31' },
  { shares: '200.00', price: '0.35' },
  { shares: '300.00', price: '0.40' },
];
export const singleOutcomeBids: AskBid[] = [
  { shares: '100.00', price: '0.30' },
  { shares: '200.00', price: '0.25' },
  { shares: '300.00', price: '0.19' },
];
const yesNoOrderBook: OrderBook = {
  1: {
    buy: singleOutcomeBids,
    sell: singleOutcomeAsks,
  },
  2: {
    buy: singleOutcomeBids,
    sell: singleOutcomeAsks,
  },
};

export interface ExtraInfo {
  categories: string[];
  description: string;
  tags: string[];
  longDescription?: string;
  _scalarDenomination?: string;
  template?: object;
}
export interface CannedMarket {
  marketType: string;
  creatorFeeDecimal?: string; // 0.10 for 10%, 0.01 for 1%, ...
  endTime: number;
  minPrice?: string;
  maxPrice?: string;
  tickSize?: string;
  outcomes?: string[];
  affiliateFeeDivisor: number;
  extraInfo: ExtraInfo;
  orderBook: OrderBook;
}

function massageMarkets(markets: CannedMarket[]): CannedMarket[] {
  return markets.map(
    (market): CannedMarket => {
      if (market.outcomes) {
        market.outcomes = market.outcomes.map(formatBytes32String);
      }
      return market;
    }
  );
}

export const cannedMarkets: CannedMarket[] = massageMarkets([
  {
    marketType: 'yesNo',
    endTime: inTenMonths.getTime() / 1000,
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ['space'],
      description:
        'Will SpaceX successfully complete a Mars landing (manned or unmanned) by ' +
        inTenMonths.toDateString() +
        ' according to http://www.spacex.com?',
      tags: ['SpaceX', 'spaceflight'],
      longDescription: '',
    },
    orderBook: yesNoOrderBook,
  },
  {
    marketType: 'yesNo',
    endTime: inThreeMonths.getTime() / 1000,
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ['augur'],
      description:
        "Will Augur's live release happen by " +
        inThreeMonths.toDateString() +
        ' according to https://augur.net?',
      tags: ['release date', 'Ethereum'],
      longDescription: '',
    },
    orderBook: yesNoOrderBook,
  },
  {
    marketType: 'scalar',
    endTime: midnightTomorrow.getTime() / 1000,
    minPrice: '-10',
    maxPrice: '120',
    tickSize: '0.1',
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ['weather', 'temperature'],
      description:
        `High temperature (in degrees Fahrenheit) on ${today.toDateString()} at the San Francisco International Airport, as reported by Weather Underground (https://www.wunderground.com/history/airport/KSFO/) ` +
        [
          today.getUTCFullYear(),
          today.getUTCMonth() + 1,
          today.getUTCDate(),
        ].join('/') +
        '/DailyHistory.html',
      tags: ['weather', 'SFO'],
      longDescription: 'https://www.penny-arcade.com/comic/2001/12/12',
      _scalarDenomination: 'degrees Fahrenheit',
    },
    orderBook: {
      2: {
        buy: [
          { shares: '100.01', price: '24' },
          { shares: '200.01', price: '0' },
          { shares: '300.01', price: '-5' },
        ],
        sell: [
          { shares: '100.01', price: '25' },
          { shares: '200.01', price: '50' },
          { shares: '300.01', price: '51' },
        ],
      },
    },
  },
  {
    marketType: 'scalar',
    endTime: inFiveMonths.getTime() / 1000,
    minPrice: '600',
    maxPrice: '5000',
    tickSize: '.01',
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ['science'],
      description:
        'Average tropospheric methane concentration (in parts-per-billion) on ' +
        inFiveMonths.toDateString() +
        ' according to https://www.esrl.noaa.gov/gmd/ccgg/trends_ch4',
      tags: ['climate', 'atmosphere'],
      longDescription:
        'Vast quantities of methane are normally locked into the Earth\'s crust on the continental plateaus in one of the many deposits consisting of compounds of methane hydrate, a solid precipitated combination of methane and water much like ice. Because the methane hydrates are unstable, except at cool temperatures and high (deep) pressures, scientists have observed smaller "burps" due to tectonic events. Studies suggest the huge release of natural gas could be a major climatological trigger, methane itself being a greenhouse gas many times more powerful than carbon dioxide. References: https://en.wikipedia.org/wiki/Anoxic_event, https://en.wikipedia.org/wiki/Atmospheric_methane, https://en.wikipedia.org/wiki/Clathrate_gun_hypothesis',
      _scalarDenomination: 'parts-per-billion',
    },
    orderBook: {},
  },
  {
    marketType: 'scalar',
    endTime: inSixMonths.getTime() / 1000,
    minPrice: '0',
    maxPrice: '30',
    tickSize: '1',
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ['medicine'],
      description:
        'New antibiotics approved by the FDA on ' +
        inSixMonths.toDateString() +
        ' according to https://www.centerwatch.com/drug-information/fda-approved-drugs/year/' +
        thisYear,
      tags: ['science', 'antibiotics'],
      longDescription:
        'Will antibiotic pan-resistance lead to a massive resurgence of infectious diseases?',
    },
    orderBook: {
      2: {
        buy: [
          { shares: '100.01', price: '20' },
          { shares: '200.01', price: '18' },
          { shares: '300.01', price: '15' },
        ],
        sell: [
          { shares: '100.01', price: '21' },
          { shares: '200.01', price: '26' },
          { shares: '300.01', price: '29' },
        ],
      },
    },
  },
  {
    marketType: 'categorical',
    endTime: inOneMonths.getTime() / 1000,
    outcomes: [
      'cancer',
      'heart attacks',
      'infectious diseases',
      'starvation',
      'covid-19',
      'other',
    ],
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ['science'],
      description:
        'What will be the number one killer in the United States by ' +
        inOneMonths.toDateString() +
        ' according to https://www.cdc.gov/nchs/nvss/deaths.htm?',
      tags: ['mortality', 'United States'],
    },
    orderBook: {
      1: {
        buy: singleOutcomeBids,
        sell: singleOutcomeAsks,
      },
      2: {
        buy: singleOutcomeBids,
        sell: singleOutcomeAsks,
      },
      3: {
        buy: singleOutcomeBids,
        sell: singleOutcomeAsks,
      },
      4: {
        buy: singleOutcomeBids,
        sell: singleOutcomeAsks,
      },
      5: {
        buy: singleOutcomeBids,
        sell: singleOutcomeAsks,
      },
      6: {
        buy: singleOutcomeBids,
        sell: singleOutcomeAsks,
      },
    },
  },
  {
    marketType: 'categorical',
    endTime: inTwoMonths.getTime() / 1000,
    outcomes: [
      'London',
      'New York',
      'Los Angeles',
      'San Francisco',
      'Tokyo',
      'Palo Alto',
      'Hong Kong',
    ],
    affiliateFeeDivisor: 4,
    extraInfo: {
      categories: ['housing'],
      description:
        'Which city will have the highest median single-family home price on ' +
        inTwoMonths.toDateString() +
        ' according to http://www.demographia.com?',
      tags: ['economy', 'bubble'],
    },
    orderBook: {
      1: {
        buy: singleOutcomeBids,
        sell: singleOutcomeAsks,
      },
      2: {
        buy: singleOutcomeBids,
        sell: singleOutcomeAsks,
      },
      3: {
        buy: singleOutcomeBids,
        sell: singleOutcomeAsks,
      },
      4: {
        buy: singleOutcomeBids,
        sell: singleOutcomeAsks,
      },
      5: {
        buy: singleOutcomeBids,
        sell: singleOutcomeAsks,
      },
      6: {
        buy: singleOutcomeBids,
        sell: singleOutcomeAsks,
      },
      7: {
        buy: singleOutcomeBids,
        sell: singleOutcomeAsks,
      },
    },
  },
]);

export const templatedCannedMarkets = (): CannedMarket[] => {
  const markets = [];

  const usPoliticsTemplates = TEMPLATES[POLITICS].children[US_POLITICS]
    .templates as Template[];
  const template1: Template = usPoliticsTemplates[0];
  const usInputValues = ['Donald Trump', '2020'];
  markets.push({
    marketType: 'yesNo',
    endTime: inTenMonths.getTime() / 1000,
    affiliateFeeDivisor: 0,
    creatorFeeDecimal: '0.01',
    extraInfo: {
      categories: ['Politics', 'US Politics'],
      description: 'Will Donald Trump win the 2020 U.S. Presidential election?',
      tags: [],
      longDescription: getLongDescription(template1),
      template: {
        hash: template1.hash,
        question: template1.question,
        inputs: getFilledInputs(template1, usInputValues),
      },
    },
    orderBook: yesNoOrderBook,
  });

  const finTemplates = TEMPLATES[FINANCE].children[INDEXES]
    .templates as Template[];
  const finTemplate: Template = finTemplates[0];
  const wed = 3;
  const finExpDate = moment()
    .day(wed)
    .add(3, 'weeks')
    .add(6, 'hours');
  const date = finExpDate.format('MMMM DD, YYYY');
  const finUnixEndTime = finExpDate.unix();
  const finInputValues = ['Dow Jones Industrial Average', '25000', date];
  markets.push({
    marketType: 'yesNo',
    endTime: finUnixEndTime,
    affiliateFeeDivisor: 0,
    creatorFeeDecimal: '0.015',
    extraInfo: {
      categories: [FINANCE, INDEXES],
      description: fillInQuestion(finTemplate, finInputValues),
      tags: [],
      longDescription: getLongDescription(finTemplate),
      template: {
        hash: finTemplate.hash,
        question: finTemplate.question,
        inputs: getFilledInputs(finTemplate, finInputValues),
      },
    },
    orderBook: yesNoOrderBook,
  });

  const fbTemplates = TEMPLATES[SPORTS].children[AMERICAN_FOOTBALL].children[
    NFL
  ].templates as Template[];
  const fbTemplate: Template = fbTemplates[3];
  const expDate = moment().add(3, 'weeks');
  const year = expDate.year();
  const unixEndTime = expDate.unix();
  const inputValues = ['Dallas Cowboys', '9', String(year)];
  markets.push({
    marketType: 'yesNo',
    endTime: unixEndTime,
    affiliateFeeDivisor: 0,
    creatorFeeDecimal: '0.01',
    extraInfo: {
      categories: [SPORTS, AMERICAN_FOOTBALL, NFL],
      description: fillInQuestion(fbTemplate, inputValues),
      tags: [],
      longDescription: getLongDescription(fbTemplate),
      template: {
        hash: fbTemplate.hash,
        question: fbTemplate.question,
        inputs: getFilledInputs(fbTemplate, inputValues),
      },
    },
    orderBook: yesNoOrderBook,
  });

  const socTemplates = TEMPLATES[SPORTS].children[SOCCER].children[MENS_LEAGUES]
    .templates as Template[];
  const socTemplate: Template = socTemplates[0];
  const socExpDate = moment().add(3, 'weeks');
  const estTime = socExpDate.unix();
  const socEndTime = socExpDate.add(8, 'hours').unix();
  const socInputValues = [
    'English Premier League',
    'Liverpool',
    'Manchester United',
    String(estTime),
  ];
  const convertedMarkets = massageMarkets([
    {
      marketType: 'categorical',
      endTime: socEndTime,
      affiliateFeeDivisor: 0,
      creatorFeeDecimal: '0.01',
      outcomes: [
        'Liverpool',
        'Manchester United',
        'Draw',
        'Unofficial game/Cancelled',
      ],
      extraInfo: {
        categories: [SPORTS, SOCCER, MENS_LEAGUES],
        description: fillInQuestion(socTemplate, socInputValues),
        tags: [],
        longDescription: getLongDescription(socTemplate),
        template: {
          hash: socTemplate.hash,
          question: socTemplate.question,
          inputs: getFilledInputs(socTemplate, socInputValues),
        },
      },
      orderBook: {
        1: {
          buy: singleOutcomeBids,
          sell: singleOutcomeAsks,
        },
        2: {
          buy: singleOutcomeBids,
          sell: singleOutcomeAsks,
        },
        3: {
          buy: singleOutcomeBids,
          sell: singleOutcomeAsks,
        },
        4: {
          buy: singleOutcomeBids,
          sell: singleOutcomeAsks,
        },
      },
    },
  ]);

  markets.push(convertedMarkets[0]);

  const draftTemplates = TEMPLATES[SPORTS].children[AMERICAN_FOOTBALL].children[NFL_DRAFT]
  .templates as Template[];
  const draftTemplate: Template = draftTemplates[1];
  const draftExpDate = moment().add(4, 'weeks');
  const draftEstTime = draftExpDate.unix();
  const draftEndTime = draftExpDate.add(50, 'hours').unix();
  const draftInputValues = [
    '2020',
    'Wide Receiver',
    String(draftEstTime),
  ];

  const draftMarkets = massageMarkets([
    {
      marketType: 'categorical',
      endTime: draftEndTime,
      affiliateFeeDivisor: 0,
      creatorFeeDecimal: '0.01',
      outcomes: [
        'Jonny B',
        'Eric C',
        'Mac D',
        'Linny Q',
        'Other (Field)'
      ],
      extraInfo: {
        categories: [SPORTS, AMERICAN_FOOTBALL, NFL_DRAFT],
        description: fillInQuestion(draftTemplate, draftInputValues),
        tags: [],
        longDescription: getLongDescription(draftTemplate),
        template: {
          hash: draftTemplate.hash,
          question: draftTemplate.question,
          inputs: getFilledInputs(draftTemplate, draftInputValues),
        },
      },
      orderBook: {
        1: {
          buy: singleOutcomeBids,
          sell: singleOutcomeAsks,
        },
        2: {
          buy: singleOutcomeBids,
          sell: singleOutcomeAsks,
        },
        3: {
          buy: singleOutcomeBids,
          sell: singleOutcomeAsks,
        },
        4: {
          buy: singleOutcomeBids,
          sell: singleOutcomeAsks,
        },
      },
    },
  ]);

  markets.push(draftMarkets[0]);

  const golfTemplates = TEMPLATES[SPORTS].children[GOLF].children[PGA]
    .templates as Template[];
  const golfTemplate: Template = golfTemplates[3];
  const golfExpDate = moment().add(4, 'weeks');
  const golfYear = golfExpDate.year();
  const golfEstTime = golfExpDate.unix();
  const golfInputValues = [String(golfYear), 'PGA Championship'];
  const converteGolfdMarkets = massageMarkets([
    {
      marketType: 'categorical',
      endTime: golfEstTime,
      affiliateFeeDivisor: 0,
      creatorFeeDecimal: '0.01',
      outcomes: [
        'Dustin Johnson',
        'Tiger Woods',
        'Brooks Koepka',
        'Rory Mcllroy',
        'Jason Day',
        'Other (Field)',
        'No winner/Event cancelled',
      ],
      extraInfo: {
        categories: [SPORTS, GOLF, PGA],
        description: fillInQuestion(golfTemplate, golfInputValues),
        tags: [],
        longDescription: getLongDescription(golfTemplate),
        template: {
          hash: golfTemplate.hash,
          question: golfTemplate.question,
          inputs: getFilledInputs(golfTemplate, golfInputValues),
        },
      },
      orderBook: {
        1: {
          buy: singleOutcomeBids,
          sell: singleOutcomeAsks,
        },
        2: {
          buy: singleOutcomeBids,
          sell: singleOutcomeAsks,
        },
        3: {
          buy: singleOutcomeBids,
          sell: singleOutcomeAsks,
        },
        4: {
          buy: singleOutcomeBids,
          sell: singleOutcomeAsks,
        },
        5: {
          buy: singleOutcomeBids,
          sell: singleOutcomeAsks,
        },
        6: {
          buy: singleOutcomeBids,
          sell: singleOutcomeAsks,
        },
      },
    },
  ]);

  markets.push(converteGolfdMarkets[0]);

  const cryptoTemplates = TEMPLATES[CRYPTO].children[ETHEREUM]
    .templates as Template[];
  const cryptoTemplate: Template = cryptoTemplates[2];
  const cryptoExpDate = moment().add(3, 'weeks');
  const cryptoEstTime = cryptoExpDate.unix();
  const cryptoEndTime = cryptoExpDate.add(20, 'hours').unix();
  const cryptoDate = cryptoExpDate.format('MMMM DD, YYYY');
  const cryptoInputValues = [
    'ETH/USD',
    cryptoDate,
    'ETHUSD (crypto - Bittrex)',
  ];
  let cryptoInputs = getFilledInputs(cryptoTemplate, cryptoInputValues);
  cryptoInputs = cryptoInputs[2].timestamp = cryptoEstTime;
  markets.push({
    marketType: 'scalar',
    endTime: cryptoEndTime,
    minPrice: '120',
    maxPrice: '200',
    tickSize: '0.01',
    affiliateFeeDivisor: 0,
    creatorFeeDecimal: '0.01',
    extraInfo: {
      categories: [CRYPTO, ETHEREUM, 'ETHUSD (crypto - Bittrex)'],
      description: fillInQuestion(cryptoTemplate, cryptoInputValues),
      tags: [],
      longDescription: getLongDescription(cryptoTemplate),
      template: {
        hash: cryptoTemplate.hash,
        question: cryptoTemplate.question,
        inputs: getFilledInputs(cryptoTemplate, cryptoInputValues),
      },
    },
    orderBook: {
      2: {
        buy: [
          { shares: '10.01', price: '131' },
          { shares: '20.01', price: '135' },
          { shares: '30.01', price: '140' },
        ],
        sell: [
          { shares: '10.01', price: '145' },
          { shares: '20.01', price: '150' },
          { shares: '30.01', price: '160' },
        ],
      },
    },
  });

  const bbTemplates = TEMPLATES[SPORTS].children[BASKETBALL].children[NBA]
    .templates as Template[];
  const bbTemplate: Template = bbTemplates[11];
  const bbExpDate = moment()
    .add(2, 'weeks')
    .add(8, 'hours');
  const bbDateYear = bbExpDate.format('YY');
  const bbYears = `20${bbDateYear}-${Number(bbDateYear) + 1}`;
  const bbInputValues = ['LA Lakers', bbYears];
  markets.push({
    marketType: 'scalar',
    endTime: bbExpDate.unix(),
    minPrice: '0',
    maxPrice: '82',
    tickSize: '0.1',
    affiliateFeeDivisor: 0,
    creatorFeeDecimal: '0.01',
    extraInfo: {
      categories: [SPORTS, BASKETBALL, NBA],
      description: fillInQuestion(bbTemplate, bbInputValues),
      tags: [],
      longDescription: getLongDescription(bbTemplate),
      template: {
        hash: bbTemplate.hash,
        question: bbTemplate.question,
        inputs: getFilledInputs(bbTemplate, bbInputValues),
      },
    },
    orderBook: {
      2: {
        buy: [
          { shares: '10.01', price: '40' },
          { shares: '20.01', price: '45' },
          { shares: '30.01', price: '50' },
        ],
        sell: [
          { shares: '10.01', price: '51' },
          { shares: '20.01', price: '65' },
          { shares: '30.01', price: '60' },
        ],
      },
    },
  });

  return markets;
};

const fillInQuestion = (template, values) => {
  let description = template.question;
  template.inputs.forEach(input => {
    let value = values[input.id];
    description = description.replace(`[${input.id}]`, `${value}`);
  });
  return description;
};

const getLongDescription = template => {
  return template.resolutionRules[REQUIRED].map(m => m.text).join('\n');
};

const getFilledInputs = (template, values) => {
  return values.map((value, index) => ({
    id: template.inputs[index].id,
    type: template.inputs[index].type,
    value,
    timestamp: !isNaN(value) ? value : null,
  }));
};
