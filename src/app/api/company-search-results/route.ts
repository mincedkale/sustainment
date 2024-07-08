import { NextResponse } from 'next/server';
import { CompanyGenericData } from '@/app/types/companyData/types';
import { NextRequest } from 'next/server';
import postgres from 'postgres';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('query');
  const keywords = query && query.split(' ');
  const companyDataList: CompanyGenericData[] = [];
  
  const sql = process.env.DATABASE_URL && postgres(process.env.DATABASE_URL, { ssl: 'require' });
  if (!sql || !keywords) {
    throw new Error('DATABASE_URL is not set OR query is empty');
  }

  await Promise.all(keywords.map(async (keyword) => {
    const retrievedCompanies = await sql<CompanyGenericData[]>`
      SELECT * FROM company_data_generic
      WHERE company_name ~* ${'\\y' + keyword + '\\y'}
      OR stock_ticker ~* ${'\\y' + keyword + '\\y'}
      OR description ~* ${'\\y' + keyword + '\\y'}
    `;
    companyDataList.push(...retrievedCompanies);
  }));

  //console.log(companyDataList)
  return NextResponse.json(companyDataList);
}

//  SAVE THIS FUNCTION TO INITIALIZE THE DATABASE TABLE
/*
async function injectData(companyDataList: CompanyGenericData[]) {
  const sql = process.env.DATABASE_URL && postgres(process.env.DATABASE_URL, { ssl: 'require' });
  if (!sql) {
    throw new Error('DATABASE_URL is not set');
  }
  await sql`DROP TABLE IF EXISTS company_data_generic`;
  await sql`CREATE TABLE IF NOT EXISTS company_data_generic (
    company_name TEXT,
    stock_ticker TEXT,
    current_price NUMERIC,
    description TEXT
  )`;

  for (const companyData of companyDataList) {
    await sql`INSERT INTO company_data_generic (company_name, stock_ticker, current_price, description) 
      VALUES (${companyData.company_name}, ${companyData.stock_ticker}, ${companyData.current_price}, ${companyData.description})`;
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const querey = searchParams.get('query');
  
  const companyDataList: CompanyGenericData[] = [
    {
      company_name: "SolarTech Innovations",
      stock_ticker: "SOL",
      current_price: 180.5,
      description: "Leading provider of solar energy solutions, specializing in innovative photovoltaic technologies and sustainable energy infrastructure. With a commitment to reducing carbon footprints globally, SolarTech Innovations continues to pioneer advancements in solar power generation and integration.",
    },
    {
      company_name: "WindPower Ltd.",
      stock_ticker: "WPL",
      current_price: 210.3,
      description: "Prominent developer of wind energy projects, dedicated to harnessing the power of wind through state-of-the-art turbine technology and sustainable energy practices. Known for its expansive wind farms across diverse geographical regions, WindPower Ltd. contributes significantly to renewable energy production worldwide.",
    },
    {
      company_name: "Organic Foods Inc.",
      stock_ticker: "OFI",
      current_price: 320.8,
      description: "Trusted supplier of organic food products, advocating sustainable agriculture practices and ethical sourcing. Committed to promoting health and environmental stewardship, Organic Foods Inc. supports local farmers and strives to meet growing consumer demand for organic, GMO-free food options.",
    },
    {
      company_name: "Recycling Solutions Group",
      stock_ticker: "RSG",
      current_price: 150.2,
      description: "Innovative leader in recycling technologies and waste management solutions. Specializing in advanced sorting and processing systems, Recycling Solutions Group maximizes resource recovery and minimizes environmental impact through efficient recycling practices.",
    },
    {
      company_name: "Ethical Fashion Co.",
      stock_ticker: "EFC",
      current_price: 80.6,
      description: "Pioneering clothing brand committed to fair trade practices and sustainable materials. Ethical Fashion Co. promotes a fashion industry that values workers' rights and environmental conservation through transparent and ethical production methods.",
    },
    {
      company_name: "Clean Water Initiatives",
      stock_ticker: "CWI",
      current_price: 95.4,
      description: "Provider of clean water solutions to underserved communities worldwide. Clean Water Initiatives addresses water scarcity challenges and promotes sustainable access to safe drinking water through innovative water purification technologies and community-based projects.",
    },
    {
      company_name: "Green Building Solutions",
      stock_ticker: "GBS",
      current_price: 280.9,
      description: "Leader in sustainable building materials and construction practices. Green Building Solutions advocates for eco-friendly building designs, energy-efficient solutions, and green building certifications, contributing to reducing the environmental impact of urban development.",
    },
    {
      company_name: "Renewable Energy Corporation",
      stock_ticker: "REC",
      current_price: 410.7,
      description: "Invests in diversified renewable energy projects globally, focusing on solar, wind, and hydroelectric power generation. Renewable Energy Corporation plays a crucial role in advancing clean energy transitions and promoting sustainable energy investments worldwide.",
    },
    {
      company_name: "Carbon Neutral Technologies",
      stock_ticker: "CNT",
      current_price: 370.2,
      description: "Developer of innovative technologies aimed at achieving carbon neutrality across various industries. Carbon Neutral Technologies leads initiatives in carbon capture, renewable energy integration, and sustainable industrial practices to combat climate change.",
    },
    {
      company_name: "Biodiversity Conservation Group",
      stock_ticker: "BCG",
      current_price: 120.5,
      description: "Works to preserve biodiversity through conservation efforts and habitat restoration projects. Biodiversity Conservation Group partners with local communities and wildlife conservation organizations to protect endangered species and promote ecosystem resilience.",
    },
    {
      company_name: "Community Solar Solutions",
      stock_ticker: "CSS",
      current_price: 240.6,
      description: "Brings solar power to underserved communities through community-based solar initiatives. Community Solar Solutions focuses on democratizing access to clean energy and promoting sustainable development in remote and economically disadvantaged areas.",
    },
    {
      company_name: "Fair Trade Enterprises",
      stock_ticker: "FTE",
      current_price: 180.3,
      description: "Supports fair trade practices across global supply chains. Fair Trade Enterprises ensures fair wages, safe working conditions, and environmental sustainability in its supply chain, promoting ethical consumerism and social responsibility.",
    },
    {
      company_name: "Eco-friendly Transport Co.",
      stock_ticker: "ETC",
      current_price: 130.9,
      description: "Developer of electric and hybrid vehicles for sustainable transportation solutions. Eco-friendly Transport Co. advances eco-mobility with innovative vehicle technologies, reducing carbon emissions and promoting cleaner urban transport systems.",
    },
    {
      company_name: "Sustainable Agriculture Group",
      stock_ticker: "SAG",
      current_price: 310.2,
      description: "Promotes regenerative farming practices and organic agriculture. Sustainable Agriculture Group supports sustainable food production through ecological farming methods, soil health initiatives, and community-supported agriculture programs.",
    },
    {
      company_name: "Clean Energy Solutions",
      stock_ticker: "CES",
      current_price: 290.8,
      description: "Provider of clean energy solutions including solar and wind power. Clean Energy Solutions advances renewable energy adoption with scalable clean energy technologies and sustainable energy infrastructure projects.",
    },
    {
      company_name: "Social Impact Fund",
      stock_ticker: "SIF",
      current_price: 150.4,
      description: "Invests in projects with positive social and environmental outcomes. Social Impact Fund supports initiatives that address global challenges such as poverty alleviation, environmental conservation, and sustainable development.",
    },
    {
      company_name: "Green Technology Innovators",
      stock_ticker: "GTI",
      current_price: 200.7,
      description: "Develops innovative technologies to mitigate environmental impact. Green Technology Innovators focuses on sustainability through green tech solutions, including renewable energy innovations, waste reduction technologies, and environmental monitoring systems.",
    },
    {
      company_name: "Renewable Resources Group",
      stock_ticker: "RRG",
      current_price: 180.1,
      description: "Invests in sustainable forestry and renewable resource management. Renewable Resources Group promotes responsible forestry practices, biodiversity conservation, and sustainable resource extraction for ecological balance and long-term environmental stewardship.",
    },
    {
      company_name: "Ocean Conservation Society",
      stock_ticker: "OCS",
      current_price: 90.5,
      description: "Works to protect marine ecosystems and promote ocean sustainability. Ocean Conservation Society engages in marine conservation initiatives, including habitat restoration, marine species protection, and sustainable fisheries management.",
    },
    {
      company_name: "Green Building Materials",
      stock_ticker: "GBM",
      current_price: 250.3,
      description: "Produces eco-friendly building materials and construction solutions. Green Building Materials specializes in sustainable building materials, promoting energy-efficient building designs and green construction practices for environmental sustainability.",
    },
    {
      company_name: "Tesla, Inc.",
      stock_ticker: "TSLA",
      current_price: 680.99,
      description: "Leader in electric vehicles and sustainable energy solutions. Tesla, Inc. designs and manufactures electric vehicles, renewable energy products, and energy storage solutions to accelerate the world's transition to sustainable energy.",
    },
    {
      company_name: "Patagonia, Inc.",
      stock_ticker: "PRIVATE",
      current_price: 2.0,
      description: "Outdoor apparel company committed to environmental activism. Patagonia, Inc. promotes environmental sustainability through ethical manufacturing practices, conservation initiatives, and advocacy for environmental policies.",
    },
    {
      company_name: "Vestas Wind Systems",
      stock_ticker: "VWS.CO",
      current_price: 150.45,
      description: "Global leader in wind turbine manufacturing and renewable energy. Vestas Wind Systems designs, manufactures, and installs wind turbines worldwide, contributing to the expansion of clean energy solutions and sustainable wind power generation.",
    },
    {
      company_name: "Beyond Meat, Inc.",
      stock_ticker: "BYND",
      current_price: 120.67,
      description: "Producer of plant-based meat alternatives promoting sustainability. Beyond Meat, Inc. develops plant-based meat substitutes to reduce environmental impact and promote sustainable food choices, aiming to address global food security and climate change.",
    },
    {
      company_name: "Unilever",
      stock_ticker: "UL",
      current_price: 55.34,
      description: "Consumer goods company focused on sustainable living and social impact. Unilever integrates sustainability into its business strategy, producing household products and food brands that prioritize environmental stewardship, social responsibility, and ethical sourcing.",
    },
    {
      company_name: "Enphase Energy, Inc.",
      stock_ticker: "ENPH",
      current_price: 220.56,
      description: "Provider of solar energy solutions and energy management technology. Enphase Energy, Inc. specializes in solar microinverter systems and energy management technology, enabling efficient solar power generation and grid integration for residential and commercial applications.",
    },
    {
      company_name: "Acciona",
      stock_ticker: "ANA.MC",
      current_price: 85.32,
      description: "Global leader in sustainable infrastructure and renewable energy. Acciona develops and operates renewable energy projects, sustainable infrastructure, and water management solutions worldwide, advancing sustainable development and environmental stewardship.",
    },
    {
      company_name: "Interface, Inc.",
      stock_ticker: "TILE",
      current_price: 30.45,
      description: "Pioneer in sustainable flooring and modular carpet tiles. Interface, Inc. leads the industry with sustainable manufacturing practices, recycled materials, and carbon-neutral operations, promoting environmentally responsible flooring solutions worldwide.",
    },
    {
      company_name: "EDP Renewables",
      stock_ticker: "EDPR.LS",
      current_price: 17.89,
      description: "Global renewable energy company specializing in wind and solar power. EDP Renewables develops, constructs, and operates wind farms and solar parks globally, contributing to the expansion of clean and sustainable energy solutions.",
    },
    {
      company_name: "SunPower Corporation",
      stock_ticker: "SPWR",
      current_price: 22.67,
      description: "Innovator in solar power technology and solar panel manufacturing. SunPower Corporation designs high-efficiency solar panels and develops solar energy solutions for residential, commercial, and utility-scale projects, promoting widespread adoption of solar energy.",
    },
    {
      company_name: "Canadian Solar Inc.",
      stock_ticker: "CSIQ",
      current_price: 45.78,
      description: "Global provider of solar PV modules and renewable energy solutions. Canadian Solar Inc. manufactures solar photovoltaic modules and provides solar energy solutions, contributing to the global transition to clean and sustainable energy sources.",
    },
    {
      company_name: "Boralex Inc.",
      stock_ticker: "BLX.TO",
      current_price: 25.91,
      description: "Canadian leader in renewable energy development and power generation. Boralex Inc. operates renewable energy facilities, including wind, hydroelectric, solar, and thermal projects, supporting sustainable energy production and environmental conservation.",
    },
    {
      company_name: "Alterra Power Corp.",
      stock_ticker: "AXY.TO",
      current_price: 8.76,
      description: "Developer and operator of renewable energy projects across North America. Alterra Power Corp. specializes in wind, hydro, solar, and geothermal energy projects, advancing renewable energy development and sustainable power generation.",
    },
    {
      company_name: "Pattern Energy Group Inc.",
      stock_ticker: "PEGI",
      current_price: 27.54,
      description: "Investor and operator of renewable energy projects in North America, Japan, and Chile. Pattern Energy Group Inc. focuses on wind, solar, transmission, and energy storage projects, contributing to the growth of clean energy infrastructure globally.",
    },
    {
      company_name: "Brookfield Renewable Partners L.P.",
      stock_ticker: "BEP",
      current_price: 45.67,
      description: "Global leader in renewable power generation and energy storage solutions. Brookfield Renewable Partners L.P. owns and operates renewable energy assets, including hydroelectric, wind, solar, and energy storage facilities, promoting sustainable energy solutions worldwide.",
    },
    {
      company_name: "NextEra Energy, Inc.",
      stock_ticker: "NEE",
      current_price: 98.45,
      description: "Leading clean energy company in North America and a pioneer in renewable energy. NextEra Energy, Inc. generates electricity from renewable sources, including wind, solar, and nuclear power, advancing clean energy initiatives and environmental sustainability.",
    },
    {
      company_name: "DONG Energy",
      stock_ticker: "PRIVATE",
      current_price: 150.0,
      description: "Danish renewable energy company focused on offshore wind farms and energy solutions. DONG Energy leads in offshore wind energy development, contributing to sustainable energy production and reducing carbon emissions globally.",
    },
    {
      company_name: "Suzlon Energy Ltd.",
      stock_ticker: "SUZLON.NS",
      current_price: 5.67,
      description: "Indian multinational wind turbine manufacturer and renewable energy solutions provider. Suzlon Energy Ltd. develops wind turbines and provides renewable energy solutions, contributing to India's renewable energy goals and global clean energy transition.",
    },
    {
      company_name: "Vattenfall",
      stock_ticker: "PRIVATE",
      current_price: 60.78,
      description: "Swedish multinational power company focused on sustainable energy solutions. Vattenfall generates electricity and provides heat, focusing on wind power, hydropower, and nuclear power, promoting sustainable energy production and environmental stewardship.",
    },
    {
      company_name: "Covanta Holding Corporation",
      stock_ticker: "CVA",
      current_price: 18.90,
      description: "Leader in sustainable waste management and energy solutions. Covanta Holding Corporation operates waste-to-energy and renewable energy facilities, converting waste into clean, sustainable energy and reducing landfill waste globally.",
    },
    {
      company_name: "Veolia Environnement",
      stock_ticker: "VIE.PA",
      current_price: 32.10,
      description: "Global leader in optimized resource management and sustainable solutions. Veolia Environnement provides water, waste, and energy management services, promoting resource efficiency, environmental sustainability, and circular economy principles.",
    }
    // Add more company data objects as needed
  ];

  await injectData(companyDataList);

  return NextResponse.json(companyDataList);
}*/