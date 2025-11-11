import {
  State,
  City,
  Center,
  OrganizationType,
  Industry,
  Organization,
  Country,
  Currency,
  Timezone,
  DateFormat,
  Language
} from '../models/master-data';

export const seedMasterData = async () => {
  try {
    console.log('🌱 Seeding master data...');

    // Check and seed Organization Types
    const orgTypeCount = await OrganizationType.countDocuments();
    if (orgTypeCount === 0) {
      await OrganizationType.insertMany([
        { key: 'government', value: 'Government', description: 'Government organization or department', displayOrder: 1, isActive: true },
        { key: 'ngo', value: 'NGO', description: 'Non-governmental organization', displayOrder: 2, isActive: true },
        { key: 'private', value: 'Private', description: 'Private sector organization', displayOrder: 3, isActive: true },
        { key: 'partner', value: 'Partner', description: 'Partner organization', displayOrder: 4, isActive: true },
      ]);
      console.log('✅ Organization Types seeded');
    } else {
      console.log('ℹ️  Organization Types already exist');
    }

    // Check and seed Industries
    const industryCount = await Industry.countDocuments();
    if (industryCount === 0) {
      await Industry.insertMany([
        { key: 'technology', value: 'Technology', description: 'Technology and IT services', displayOrder: 1, isActive: true },
        { key: 'manufacturing', value: 'Manufacturing', description: 'Manufacturing and production', displayOrder: 2, isActive: true },
        { key: 'healthcare', value: 'Healthcare', description: 'Healthcare and medical services', displayOrder: 3, isActive: true },
        { key: 'finance', value: 'Finance', description: 'Financial services and banking', displayOrder: 4, isActive: true },
        { key: 'education', value: 'Education', description: 'Education and training services', displayOrder: 5, isActive: true },
        { key: 'retail', value: 'Retail', description: 'Retail and e-commerce', displayOrder: 6, isActive: true },
        { key: 'telecom', value: 'Telecommunications', description: 'Telecommunications services', displayOrder: 7, isActive: true },
        { key: 'other', value: 'Other', description: 'Other industries', displayOrder: 8, isActive: true },
      ]);
      console.log('✅ Industries seeded');
    } else {
      console.log('ℹ️  Industries already exist');
    }

    // Check and seed Countries
    const countryCount = await Country.countDocuments();
    if (countryCount === 0) {
      await Country.insertMany([
        { key: 'india', value: 'India', description: 'Republic of India', displayOrder: 1, isActive: true, dialCode: '+91', code: 'IN' },
        { key: 'usa', value: 'United States', description: 'United States of America', displayOrder: 2, isActive: true, dialCode: '+1', code: 'US' },
        { key: 'uk', value: 'United Kingdom', description: 'United Kingdom', displayOrder: 3, isActive: true, dialCode: '+44', code: 'GB' },
        { key: 'canada', value: 'Canada', description: 'Canada', displayOrder: 4, isActive: true, dialCode: '+1', code: 'CA' },
        { key: 'australia', value: 'Australia', description: 'Australia', displayOrder: 5, isActive: true, dialCode: '+61', code: 'AU' },
      ]);
      console.log('✅ Countries seeded');
    } else {
      console.log('ℹ️  Countries already exist');
    }

    // Check and seed States (Indian states)
    const stateCount = await State.countDocuments();
    if (stateCount === 0) {
      await State.insertMany([
        { key: 'maharashtra', value: 'Maharashtra', displayOrder: 1, isActive: true, country: 'india' },
        { key: 'delhi', value: 'Delhi', displayOrder: 2, isActive: true, country: 'india' },
        { key: 'karnataka', value: 'Karnataka', displayOrder: 3, isActive: true, country: 'india' },
        { key: 'tamilnadu', value: 'Tamil Nadu', displayOrder: 4, isActive: true, country: 'india' },
        { key: 'gujarat', value: 'Gujarat', displayOrder: 5, isActive: true, country: 'india' },
        { key: 'westbengal', value: 'West Bengal', displayOrder: 6, isActive: true, country: 'india' },
        { key: 'rajasthan', value: 'Rajasthan', displayOrder: 7, isActive: true, country: 'india' },
        { key: 'uttarpradesh', value: 'Uttar Pradesh', displayOrder: 8, isActive: true, country: 'india' },
        { key: 'telangana', value: 'Telangana', displayOrder: 9, isActive: true, country: 'india' },
        { key: 'andhrapradesh', value: 'Andhra Pradesh', displayOrder: 10, isActive: true, country: 'india' },
        { key: 'kerala', value: 'Kerala', displayOrder: 11, isActive: true, country: 'india' },
        { key: 'madhyapradesh', value: 'Madhya Pradesh', displayOrder: 12, isActive: true, country: 'india' },
        { key: 'punjab', value: 'Punjab', displayOrder: 13, isActive: true, country: 'india' },
      ]);
      console.log('✅ States seeded');
    } else {
      console.log('ℹ️  States already exist');
    }

    // Check and seed Cities
    const cityCount = await City.countDocuments();
    if (cityCount === 0) {
      await City.insertMany([
        { key: 'mumbai', value: 'Mumbai', displayOrder: 1, isActive: true, state: 'maharashtra', country: 'india' },
        { key: 'pune', value: 'Pune', displayOrder: 2, isActive: true, state: 'maharashtra', country: 'india' },
        { key: 'delhi', value: 'Delhi', displayOrder: 3, isActive: true, state: 'delhi', country: 'india' },
        { key: 'bangalore', value: 'Bangalore', displayOrder: 4, isActive: true, state: 'karnataka', country: 'india' },
        { key: 'hyderabad', value: 'Hyderabad', displayOrder: 5, isActive: true, state: 'telangana', country: 'india' },
        { key: 'chennai', value: 'Chennai', displayOrder: 6, isActive: true, state: 'tamilnadu', country: 'india' },
        { key: 'kolkata', value: 'Kolkata', displayOrder: 7, isActive: true, state: 'westbengal', country: 'india' },
        { key: 'ahmedabad', value: 'Ahmedabad', displayOrder: 8, isActive: true, state: 'gujarat', country: 'india' },
        { key: 'jaipur', value: 'Jaipur', displayOrder: 9, isActive: true, state: 'rajasthan', country: 'india' },
        { key: 'lucknow', value: 'Lucknow', displayOrder: 10, isActive: true, state: 'uttarpradesh', country: 'india' },
      ]);
      console.log('✅ Cities seeded');
    } else {
      console.log('ℹ️  Cities already exist');
    }

    // Check and seed Centers
    const centerCount = await Center.countDocuments();
    if (centerCount === 0) {
      await Center.insertMany([
        {
          key: 'mumbai_ho',
          value: 'Mumbai Head Office',
          description: 'Main headquarters in Mumbai',
          displayOrder: 1,
          isActive: true,
          address: 'Bandra Kurla Complex, Bandra East',
          city: 'mumbai',
          state: 'maharashtra',
          zipcode: '400051',
          timing: 'Mon-Fri: 9:00 AM - 6:00 PM',
          googleMapLink: 'https://maps.google.com/?q=Bandra+Kurla+Complex',
          phone: '+91-22-26571234',
          email: 'mumbai.ho@helpdesk.gov.in'
        },
        {
          key: 'delhi_ro',
          value: 'Delhi Regional Office',
          description: 'Regional office in Delhi',
          displayOrder: 2,
          isActive: true,
          address: 'Connaught Place, Central Delhi',
          city: 'delhi',
          state: 'delhi',
          zipcode: '110001',
          timing: 'Mon-Fri: 9:30 AM - 5:30 PM',
          googleMapLink: 'https://maps.google.com/?q=Connaught+Place+Delhi',
          phone: '+91-11-23456789',
          email: 'delhi.ro@helpdesk.gov.in'
        },
        {
          key: 'bangalore_ro',
          value: 'Bangalore Regional Office',
          description: 'Regional office in Bangalore',
          displayOrder: 3,
          isActive: true,
          address: 'MG Road, Bangalore',
          city: 'bangalore',
          state: 'karnataka',
          zipcode: '560001',
          timing: 'Mon-Fri: 9:00 AM - 6:00 PM',
          googleMapLink: 'https://maps.google.com/?q=MG+Road+Bangalore',
          phone: '+91-80-12345678',
          email: 'bangalore.ro@helpdesk.gov.in'
        },
        {
          key: 'kolkata_ro',
          value: 'Kolkata Regional Office',
          description: 'Regional office in Kolkata',
          displayOrder: 4,
          isActive: true,
          address: 'Park Street, Kolkata',
          city: 'kolkata',
          state: 'westbengal',
          zipcode: '700016',
          timing: 'Mon-Fri: 9:30 AM - 5:30 PM',
          googleMapLink: 'https://maps.google.com/?q=Park+Street+Kolkata',
          phone: '+91-33-22345678',
          email: 'kolkata.ro@helpdesk.gov.in'
        },
        {
          key: 'pune_branch',
          value: 'Pune Branch',
          description: 'Branch office in Pune',
          displayOrder: 5,
          isActive: true,
          address: 'Shivajinagar, Pune',
          city: 'pune',
          state: 'maharashtra',
          zipcode: '411005',
          timing: 'Mon-Sat: 10:00 AM - 6:00 PM',
          googleMapLink: 'https://maps.google.com/?q=Shivajinagar+Pune',
          phone: '+91-20-25678901',
          email: 'pune.branch@helpdesk.gov.in'
        },
        {
          key: 'chennai_sc',
          value: 'Chennai Service Center',
          description: 'Service center in Chennai',
          displayOrder: 6,
          isActive: true,
          address: 'T Nagar, Chennai',
          city: 'chennai',
          state: 'tamilnadu',
          zipcode: '600017',
          timing: 'Mon-Sat: 9:00 AM - 7:00 PM',
          googleMapLink: 'https://maps.google.com/?q=T+Nagar+Chennai',
          phone: '+91-44-28901234',
          email: 'chennai.sc@helpdesk.gov.in'
        },
        {
          key: 'hyderabad_sc',
          value: 'Hyderabad Service Center',
          description: 'Service center in Hyderabad',
          displayOrder: 7,
          isActive: true,
          address: 'HITEC City, Hyderabad',
          city: 'hyderabad',
          state: 'telangana',
          zipcode: '500081',
          timing: 'Mon-Sat: 9:00 AM - 6:00 PM',
          googleMapLink: 'https://maps.google.com/?q=HITEC+City+Hyderabad',
          phone: '+91-40-67890123',
          email: 'hyderabad.sc@helpdesk.gov.in'
        },
      ]);
      console.log('✅ Centers seeded');
    } else {
      console.log('ℹ️  Centers already exist');
    }

    // Check and seed Organizations
    const organizationCount = await Organization.countDocuments();
    if (organizationCount === 0) {
      await Organization.insertMany([
        { key: 'sac', value: 'State Administrative Council', description: 'State Administrative Council', displayOrder: 1, isActive: true },
        { key: 'dit', value: 'Department of IT', description: 'Department of Information Technology', displayOrder: 2, isActive: true },
        { key: 'mha', value: 'Ministry of Home Affairs', description: 'Ministry of Home Affairs', displayOrder: 3, isActive: true },
        { key: 'nhai', value: 'NHAI', description: 'National Highways Authority of India', displayOrder: 4, isActive: true },
      ]);
      console.log('✅ Organizations seeded');
    } else {
      console.log('ℹ️  Organizations already exist');
    }

    // Check and seed Currencies
    const currencyCount = await Currency.countDocuments();
    if (currencyCount === 0) {
      await Currency.insertMany([
        { key: 'inr', value: 'Indian Rupee', description: 'Indian Rupee', displayOrder: 1, isActive: true, symbol: '₹', code: 'INR' },
        { key: 'usd', value: 'US Dollar', description: 'US Dollar', displayOrder: 2, isActive: true, symbol: '$', code: 'USD' },
        { key: 'eur', value: 'Euro', description: 'Euro', displayOrder: 3, isActive: true, symbol: '€', code: 'EUR' },
        { key: 'gbp', value: 'British Pound', description: 'British Pound Sterling', displayOrder: 4, isActive: true, symbol: '£', code: 'GBP' },
      ]);
      console.log('✅ Currencies seeded');
    } else {
      console.log('ℹ️  Currencies already exist');
    }

    // Check and seed Timezones
    const timezoneCount = await Timezone.countDocuments();
    if (timezoneCount === 0) {
      await Timezone.insertMany([
        { key: 'ist', value: 'IST - Indian Standard Time', description: 'Indian Standard Time', displayOrder: 1, isActive: true, offset: '+05:30' },
        { key: 'utc', value: 'UTC - Coordinated Universal Time', description: 'Coordinated Universal Time', displayOrder: 2, isActive: true, offset: '+00:00' },
        { key: 'est', value: 'EST - Eastern Standard Time', description: 'Eastern Standard Time', displayOrder: 3, isActive: true, offset: '-05:00' },
        { key: 'pst', value: 'PST - Pacific Standard Time', description: 'Pacific Standard Time', displayOrder: 4, isActive: true, offset: '-08:00' },
        { key: 'gmt', value: 'GMT - Greenwich Mean Time', description: 'Greenwich Mean Time', displayOrder: 5, isActive: true, offset: '+00:00' },
      ]);
      console.log('✅ Timezones seeded');
    } else {
      console.log('ℹ️  Timezones already exist');
    }

    // Check and seed Date Formats
    const dateFormatCount = await DateFormat.countDocuments();
    if (dateFormatCount === 0) {
      await DateFormat.insertMany([
        { key: 'ddmmyyyy', value: 'DD/MM/YYYY', description: 'Day/Month/Year format', displayOrder: 1, isActive: true, format: 'DD/MM/YYYY' },
        { key: 'mmddyyyy', value: 'MM/DD/YYYY', description: 'Month/Day/Year format', displayOrder: 2, isActive: true, format: 'MM/DD/YYYY' },
        { key: 'yyyymmdd', value: 'YYYY-MM-DD', description: 'Year-Month-Day format', displayOrder: 3, isActive: true, format: 'YYYY-MM-DD' },
      ]);
      console.log('✅ Date Formats seeded');
    } else {
      console.log('ℹ️  Date Formats already exist');
    }

    // Check and seed Languages
    const languageCount = await Language.countDocuments();
    if (languageCount === 0) {
      await Language.insertMany([
        { key: 'english', value: 'English', description: 'English language', displayOrder: 1, isActive: true, code: 'en' },
        { key: 'marathi', value: 'Marathi', description: 'Marathi language', displayOrder: 2, isActive: true, code: 'mr' },
        { key: 'hindi', value: 'Hindi', description: 'Hindi language', displayOrder: 3, isActive: true, code: 'hi' },
      ]);
      console.log('✅ Languages seeded');
    } else {
      console.log('ℹ️  Languages already exist');
    }

    console.log('✅ All master data seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding master data:', error);
    throw error;
  }
};
