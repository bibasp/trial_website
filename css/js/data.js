/**
 * Fallback data for Nepal Infrastructure Projects
 * This matches the structure of nepal_projects.csv
 */

const projectsData = [
    {
        project_id: "KTMR-001",
        short_name: "ktm_ring_road",
        project_name: "Kathmandu Ring Road Improvement Project",
        type_main_category: "Transportation",
        type_sub_category: "Roads",
        Province: "Bagmati",
        District: "Kathmandu",
        specific_location: "Kalanki to Chabahil section",
        status: "Ongoing",
        start_date: "2018/04/15",
        initial_end_date: "2022/12/31",
        revised_end_date: "2023/12/31",
        actual_end_date: null,
        initial_budget: 9800000000,
        revised_budget: 10500000000,
        currency: "NPR",
        funding_model: "Chinese Grant and Nepal Government",
        physical_progress_percent: 68,
        progress_updated_date: "2023/01/15",
        key_features: "8-lane road, sidewalks, dedicated cycle lanes, roadside greenery",
        challenges: "Utility relocation, traffic management during construction",
        implementing_agency: "Department of Roads",
        primary_contractor: "Shanghai Construction Group",
        sub_contractors: "Multiple local contractors",
        length_km: 14.2,
        capacity: null,
        area_hectares: null
    },
    {
        project_id: "MEWA-002",
        short_name: "melamchi_water",
        project_name: "Melamchi Water Supply Project",
        type_main_category: "Water Infrastructure",
        type_sub_category: "Water Supply",
        Province: "Bagmati",
        District: "Sindhupalchok, Kathmandu",
        specific_location: "Melamchi to Kathmandu",
        status: "Operational",
        start_date: "2008/11/30",
        initial_end_date: "2016/12/31",
        revised_end_date: "2021/03/31",
        actual_end_date: "2021/05/06",
        initial_budget: 17700000000,
        revised_budget: 36000000000,
        currency: "NPR",
        funding_model: "ADB Loan, JICA, and Nepal Government",
        physical_progress_percent: 100,
        progress_updated_date: "2021/05/06",
        key_features: "26.5 km tunnel, Treatment Plant capacity 170 MLD",
        challenges: "Geological challenges, contractor disputes, earthquake damage",
        implementing_agency: "Melamchi Water Supply Development Board",
        primary_contractor: "Sinohydro Corporation Limited",
        sub_contractors: "Multiple Nepalese and international firms",
        length_km: 26.5,
        capacity: "170 MLD",
        area_hectares: null
    },
    {
        project_id: "BARH-003",
        short_name: "barhabise_highway",
        project_name: "Barhabise-Kathmandu Highway Expansion",
        type_main_category: "Transportation",
        type_sub_category: "Highways",
        Province: "Bagmati",
        District: "Sindhupalchok, Kavrepalanchok",
        specific_location: "Barhabise to Kathmandu",
        status: "Ongoing",
        start_date: "2019/02/15",
        initial_end_date: "2023/02/14",
        revised_end_date: null,
        actual_end_date: null,
        initial_budget: 7500000000,
        revised_budget: null,
        currency: "NPR",
        funding_model: "Nepal Government and ADB Loan",
        physical_progress_percent: 45,
        progress_updated_date: "2022/12/30",
        key_features: "4-lane highway, bridges, tunnels",
        challenges: "Steep terrain, landslides, geological challenges",
        implementing_agency: "Department of Roads",
        primary_contractor: "Hazama Ando Corporation",
        sub_contractors: "Local contractors",
        length_km: 58,
        capacity: null,
        area_hectares: null
    },
    {
        project_id: "UPPE-004",
        short_name: "upper_tamakoshi",
        project_name: "Upper Tamakoshi Hydroelectric Project",
        type_main_category: "Energy",
        type_sub_category: "Hydropower",
        Province: "Bagmati",
        District: "Dolakha",
        specific_location: "Lamabagar, Bigu Rural Municipality",
        status: "Operational",
        start_date: "2011/01/15",
        initial_end_date: "2016/12/31",
        revised_end_date: "2020/12/31",
        actual_end_date: "2021/07/05",
        initial_budget: 35000000000,
        revised_budget: 79000000000,
        currency: "NPR",
        funding_model: "Domestic Financial Institutions and UCPN",
        physical_progress_percent: 100,
        progress_updated_date: "2021/07/05",
        key_features: "456 MW capacity, Vertical drop of 822m",
        challenges: "Earthquake damage, equipment transportation, COVID-19 delays",
        implementing_agency: "Upper Tamakoshi Hydropower Limited",
        primary_contractor: "Sino Hydro, China",
        sub_contractors: "Multiple international and domestic contractors",
        length_km: null,
        capacity: "456 MW",
        area_hectares: null
    },
    {
        project_id: "POKH-005",
        short_name: "pokhara_airport",
        project_name: "Pokhara Regional International Airport",
        type_main_category: "Transportation",
        type_sub_category: "Aviation",
        Province: "Gandaki",
        District: "Kaski",
        specific_location: "Pokhara",
        status: "Operational",
        start_date: "2016/07/01",
        initial_end_date: "2020/07/10",
        revised_end_date: "2022/12/31",
        actual_end_date: "2023/01/01",
        initial_budget: 22000000000,
        revised_budget: null,
        currency: "NPR",
        funding_model: "Chinese EXIM Bank Loan",
        physical_progress_percent: 100,
        progress_updated_date: "2023/01/01",
        key_features: "2500m runway, capacity to handle 1 million passengers annually",
        challenges: "Land acquisition, COVID-19 delays",
        implementing_agency: "Civil Aviation Authority of Nepal",
        primary_contractor: "China CAMC Engineering",
        sub_contractors: null,
        length_km: 2.5,
        capacity: "1 million passengers annually",
        area_hectares: 200
    },
    {
        project_id: "FAST-006",
        short_name: "fast_track",
        project_name: "Kathmandu-Terai Fast Track",
        type_main_category: "Transportation",
        type_sub_category: "Highways",
        Province: "Multiple",
        District: "Kathmandu, Lalitpur, Makwanpur",
        specific_location: "Khokana to Nijgadh",
        status: "Ongoing",
        start_date: "2019/08/15",
        initial_end_date: "2024/08/14",
        revised_end_date: null,
        actual_end_date: null,
        initial_budget: 175500000000,
        revised_budget: null,
        currency: "NPR",
        funding_model: "Nepal Army, Nepal Government",
        physical_progress_percent: 32,
        progress_updated_date: "2022/12/15",
        key_features: "4-lane expressway, 87 bridges, 6 tunnels",
        challenges: "Difficult terrain, forest clearance, community resistance",
        implementing_agency: "Nepal Army",
        primary_contractor: "Nepal Army",
        sub_contractors: "Various contractors for specific segments",
        length_km: 72.5,
        capacity: null,
        area_hectares: null
    }
];

// Export projects details for individual project pages
const projectDetailsData = {};
projectsData.forEach(project => {
    projectDetailsData[project.project_id] = project;
    if (project.short_name) {
        projectDetailsData[project.short_name] = project;
    }
});

// Add markdown source information for projects with detailed research documents
projectDetailsData["TR-AP-001"] = {
    ...projectDetailsData["TR-AP-001"],
    markdownSource: "./data/Comprehensive Research on the Gautam Buddha Intern.md"
};

// Project details data
const projectDetailsData = {
    "Fast_Track": {
        "title": "Kathmandu-Tarai Expressway",
        "status": "Ongoing",
        "basic_info": "<p>The Kathmandu-Tarai Expressway, commonly known as the Fast Track, is a high-priority national infrastructure project designed to connect Nepal's capital city, Kathmandu, to the Terai plains and the Indian border.</p><p>With a total length of 72.5 kilometers, this expressway will reduce travel time between Kathmandu and Nijgadh from the current 4-5 hours to just about 1 hour.</p>",
        "geographical": "<p>The expressway starts from Khokana in Lalitpur and ends at Nijgadh in Bara district, traversing through challenging terrains including hills, forests, and river crossings.</p>",
        "timeline": "<p>Construction began in April 2017 with an initial completion target of August 2021. Due to various challenges, the completion date has been revised to April 2027.</p><p>As of March 2025, approximately 45% of the construction has been completed.</p>",
        "references": [
            {
                "text": "Nepal Army (2024), 'Fast Track Project Progress Report'",
                "url": "https://nepalarmy.mil.np/fasttrack"
            },
            {
                "text": "Ministry of Physical Infrastructure and Transport (2023), 'Annual Report'",
                "url": "https://mopit.gov.np"
            }
        ]
    },
    "Pushpalal_Highway": {
        "title": "Mid-Hills Highway (Pushpalal Highway)",
        "status": "Ongoing",
        "basic_info": "<p>The Mid-Hills Highway, officially named Pushpalal Mid-Hill Highway, is a major east-west national highway traversing through the middle hills of Nepal.</p><p>With a total planned length of approximately 1,776 kilometers, it serves as an alternative east-west corridor to the existing East-West Highway in the Terai region.</p>",
        "geographical": "<p>Starting from Chiyo Bhanjyang in the east to Jhulaghat in the west, the highway passes through 24 districts across all provinces of Nepal.</p>",
        "timeline": "<p>The project was initiated in 2008 and remains ongoing. As of March 2025, approximately 75% of the highway has been completed at various standards, with about 50% of the total length blacktopped.</p>",
        "references": [
            {
                "text": "Department of Roads (2023). 'Annual Progress Report on National Pride Projects'",
                "url": "https://dor.gov.np"
            }
        ]
    }
    // Add details for other projects
};
