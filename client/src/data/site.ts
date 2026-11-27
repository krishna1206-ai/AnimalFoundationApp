// Content copied from https://worldanimalfoundation.org/ (home page, Nov 2026).
// Edit this file to change what the app shows. Article taps open the full
// article from the website in an in-app browser.

const SITE = 'https://worldanimalfoundation.org';
const UP = `${SITE}/wp-content/uploads`;

export interface Article {
  title: string;
  url: string;
  image: string;
  author: string;
  date: string;
}

export interface MenuItem {
  label: string;
  url?: string;
  children?: MenuItem[];
}

export const site = {
  name: 'World Animal Foundation',
  url: SITE,
  logo: `${UP}/2022/07/cropped-waf-logo-3.png`,
  searchUrl: (q: string) => `${SITE}/?s=${encodeURIComponent(q)}`,
};

export const hero = {
  title: 'Get Active For Animals',
  button: { label: 'Read More', url: `${SITE}/advocate/` },
  image: `${UP}/2022/07/518693356.jpg`,
};

export const mostRecent: Article[] = [
  {
    title: 'Pet Adoption Statistics 2026: Adoptions, Intake & Surrenders',
    url: `${SITE}/advocate/pet-adoption-statistics/`,
    image: `${UP}/2024/09/Pet-Adoption-Statistics-1.png`,
    author: 'Alexander Laybourne',
    date: 'November 26, 2026',
  },
  {
    title: 'Pet Industry Statistics 2026: Market Size, Spending & Growth',
    url: `${SITE}/advocate/pet-industry-statistics/`,
    image: `${UP}/2024/08/pet-inddustry-statistics.jpg`,
    author: 'Jen Flatt Osborn',
    date: 'November 26, 2026',
  },
  {
    title: 'Pet Spending Statistics 2026: Costs, Trends & Market Data',
    url: `${SITE}/advocate/pet-spending-statistics/`,
    image: `${UP}/2026/05/Dog_groomed_in_dog_center_202605141525.webp`,
    author: 'Monika Martyn',
    date: 'November 25, 2026',
  },
  {
    title: 'UK Pet Ownership Statistics 2026: Dogs, Cats & Households',
    url: `${SITE}/advocate/pet-ownership-statistics-uk/`,
    image: `${UP}/2024/08/How-Many-Dogs-Cats-Are-in-the-UK.jpg`,
    author: 'Monika Martyn',
    date: 'November 21, 2026',
  },
  {
    title: 'Animal Shelter Statistics 2026: Adoption, Intake & Outcomes',
    url: `${SITE}/advocate/animal-shelter-statistics/`,
    image: `${UP}/2026/05/Dog_in_animal_shelter_202605131113.webp`,
    author: 'Jen Flatt Osborn',
    date: 'November 16, 2026',
  },
  {
    title: 'Pet Ownership Statistics 2026: Most Popular Pets in the US & Worldwide',
    url: `${SITE}/advocate/pet-ownership-statistics/`,
    image: `${UP}/2024/06/Pet-Ownership-Statistics-1.jpg`,
    author: 'Monika Martyn',
    date: 'November 13, 2026',
  },
  {
    title: 'What Is Veal? Where It Comes From, Types & Calf Welfare',
    url: `${SITE}/advocate/what-is-veal/`,
    image: `${UP}/2023/02/baby_cows_standing_202604081433-scaled.webp`,
    author: 'Janet F. Murray',
    date: 'November 12, 2026',
  },
  {
    title: 'Why Are Zoos Bad? 15 Reasons Animals Suffer in Captivity',
    url: `${SITE}/advocate/how-to-help-animals/params/post/1280916/whats-wrong-with-zoos`,
    image: `${UP}/2023/03/Monkey_in_zoo_cage_202606271544-1.webp`,
    author: 'Alexander Laybourne',
    date: 'November 7, 2026',
  },
  {
    title: 'Climate Change Facts 2026: Key Statistics, Causes & Effects',
    url: `${SITE}/advocate/climate-change-facts/`,
    image: `${UP}/2023/08/Climate_Change_202607031012-1.webp`,
    author: 'Jen Flatt Osborn',
    date: 'November 6, 2026',
  },
];

export const fieldTested = {
  title: 'Field Tested',
  category: 'Dog Collars',
  articles: [
    {
      title: '6 Best Invisible Dog Fences [Tested in November 2026]',
      url: `${SITE}/dogs/best-invisible-dog-fences/`,
      image: `${UP}/2025/02/top-dog-fences.jpg`,
      author: 'Thomas Godwin',
      date: 'November 9, 2026',
    },
    {
      title: 'Best Dog Collar and Leash: 7 Top Picks for 2026',
      url: `${SITE}/dogs/best-dog-collar-and-leash/`,
      image: `${UP}/2022/09/Best-Dog-Collar-and-Leash-review.jpg`,
      author: 'Elizabeth Armstrong',
      date: 'November 6, 2026',
    },
    {
      title: 'Halo Collar 5 vs SpotOn GPS Dog Fence – Which One Deserves Your Trust?',
      url: `${SITE}/dogs/spoton-vs-halo-dog-fence/`,
      image: `${UP}/2026/10/IMG_0472-1-scaled-e1793344528934.jpg`,
      author: 'Thomas Godwin',
      date: 'October 30, 2026',
    },
  ] as Article[],
};

// NOTE: About/Mission body text is a summary of the website's wording.
// Paste the exact text from your WordPress editor here if you want it word-for-word.
export const about = {
  title: 'About Us',
  paragraphs: [
    'World Animal Foundation is your guide to wildlife and pet care. Experts warn that species are disappearing at 1,000 to 10,000 times the natural extinction rate, and we believe informed people are the best defence animals have.',
    'Our team builds every guide on careful research and authentic sources, covering animals from grizzly bears to robins, as well as farm animals and exotic pets.',
  ],
  images: [`${UP}/2022/07/518693356.jpg`, `${UP}/2022/07/518713199.jpg`],
};

export const mission = {
  title: 'Our Mission',
  quote: "In a world full of people who couldn't care less, be someone who couldn't care more!",
  paragraphs: [
    'We aim to revolutionize animal welfare and protect wildlife. WAF is a resource for animals from jungles to oceans, sharing tips, products and the basic information you need to care for your pets.',
  ],
};

export const quickLinks: MenuItem[] = [
  { label: 'A-Z Animals', url: `${SITE}/animals/` },
  { label: 'Advocate', url: `${SITE}/category/advocate/` },
  { label: 'Animal Encyclopedia', url: `${SITE}/animal_encyclopedia/` },
  { label: 'Birds', url: `${SITE}/birds/` },
  { label: 'Cats', url: `${SITE}/cats/` },
  { label: 'Companion Animals', url: `${SITE}/blog/category/companion-animals/` },
  { label: 'Dogs', url: `${SITE}/dogs/` },
  { label: 'Exotic Animals', url: `${SITE}/blog/category/exotic-animals/` },
  { label: 'Facts & Stats', url: `${SITE}/statistics/` },
];

export const asSeenOn: string[] = [
  `${UP}/2022/07/squareup.png`,
  `${UP}/2022/07/yahoo.png`,
  `${UP}/2022/07/fastcompany.png`,
  `${UP}/2023/09/treehugger.png`,
  `${UP}/2023/09/wikihow.png`,
  `${UP}/2023/09/livescience-LOGO.png`,
  `${UP}/2023/09/msn.jpg`,
  `${UP}/2023/09/runnersworld.png`,
  `${UP}/2023/09/The_Guardian.png`,
  `${UP}/2023/09/goodhousekeeping.png`,
  `${UP}/2023/09/seekingalpha.png`,
  `${UP}/2023/09/Euronews.png`,
  `${UP}/2023/09/earth911.png`,
];

export const guides: Article[] = [
  {
    title:
      'The Ugly Truth: Brands That Test on Animals and Refuse to Accept That It Is Inhumane And Unnecessary!',
    url: `${SITE}/advocate/brands-that-test-on-animals/`,
    image: `${UP}/2023/03/Brands-that-test-on-3.jpg`,
    author: 'Monika Martyn',
    date: 'March 9, 2023',
  },
  {
    title: 'Animal Testing Facts – Why Should Animal Experimentation Be Stopped?',
    url: `${SITE}/advocate/animal-testing-facts/`,
    image: `${UP}/2023/10/animal_testing_202607021123.webp`,
    author: 'Alexander Laybourne',
    date: 'October 13, 2023',
  },
  {
    title: 'Product Testing on Animals – Is It Legal, Humane, or Even Necessary?',
    url: `${SITE}/animal_encyclopedia/params/category/173772/item/1002143/`,
    image: `${UP}/2023/01/Product_Testing_on_202604201044-1.webp`,
    author: 'Monika Martyn',
    date: 'January 12, 2023',
  },
  {
    title:
      'What is Animal Testing? Reasons, Procedure, and Solutions of This Inhumane Practice Explained!',
    url: `${SITE}/advocate/what-is-animal-testing/`,
    image: `${UP}/2024/09/testing_of_animals_202604161546.webp`,
    author: 'Jen Flatt Osborn',
    date: 'September 7, 2024',
  },
  {
    title: 'How Do They Test Makeup on Animals? And How to Stop Cosmetic Testing?',
    url: `${SITE}/advocate/how-do-they-test-makeup-on-animals/`,
    image: `${UP}/2023/01/makeup_applied_on_202604071216-scaled.webp`,
    author: 'Susan Nicol',
    date: 'January 19, 2023',
  },
  {
    title: 'Tears of a Bunny: The Cruel World of Rabbit Testing',
    url: `${SITE}/advocate/rabbit-testing/`,
    image: `${UP}/2023/03/Draize_Test_of_202604071600-scaled.webp`,
    author: 'Jen Flatt Osborn',
    date: 'March 25, 2023',
  },
];

const dogResources: MenuItem[] = [
  ['Dog Age Calculator', 'dogs/age-calculator'],
  ['Dog BMI Calculator', 'dogs/bmi-calculator'],
  ['Dog Chocolate Toxicity Calculator', 'dogs/chocolate-toxicity-calculator'],
  ['Dog Food Calculator', 'dogs/food-calculator'],
  ['Dog Harness Size Calculator', 'dogs/harness-size-calculator'],
  ['Dog Life Expectancy Calculator', 'dogs/life-expectancy-calculator'],
  ['Puppy Weight Calculator', 'dogs/puppy-weight-calculator'],
  ['Dog Water Intake Calculator', 'dogs/water-intake-calculator'],
  ['Dog Crate Size Calculator', 'dogs/crate-size-calculator'],
  ['Dog Onion Toxicity Calculator', 'dogs/onion-toxicity-calculator'],
  ['Dog Raisin Toxicity Calculator', 'dogs/raisin-toxicity-calculator'],
  ['Pet Sitter Rates Calculator', 'advocate/pet-sitter-rates-calculator'],
  ['Dog Groomer Tip Calculator', 'dogs/groomer-tip-calculator'],
  ['Dog Quality of Life Calculator', 'dogs/quality-of-life-calculator'],
  ['Cost of Owning a Dog Calculator', 'dogs/cost-of-owning-a-dog-calculator'],
  ['Raw Dog Food Calculator', 'dogs/raw-dog-food-calculator'],
].map(([label, path]) => ({ label, url: `${SITE}/${path}/` }));

export const menu: MenuItem[] = [
  {
    label: 'A-Z Animals',
    url: `${SITE}/animals/`,
    children: [
      { label: 'Invertebrates', url: `${SITE}/animals/invertebrates/` },
      { label: 'Mammals', url: `${SITE}/animals/mammals/` },
      { label: 'Reptiles', url: `${SITE}/animals/reptiles/` },
      { label: 'Birds', url: `${SITE}/birds/` },
      { label: 'Fish', url: `${SITE}/fish/` },
      {
        label: 'Dogs',
        url: `${SITE}/dogs/`,
        children: [
          {
            label: 'Dog Collars',
            url: `${SITE}/dogs/collars/`,
            children: [
              { label: 'Halo Dog Collar', url: `${SITE}/dogs/halo-collar-review/` },
              { label: 'Spoton vs Halo Collar', url: `${SITE}/dogs/spoton-vs-halo-dog-fence/` },
              { label: 'SpotOn Dog Collar', url: `${SITE}/dogs/spoton-dog-collar-review/` },
            ],
          },
          { label: 'Dog Fence', url: `${SITE}/dogs/fences/` },
          { label: 'Dog Training', url: `${SITE}/dogs/dog-training/` },
          { label: 'Dog Harness', url: `${SITE}/dogs/harness/` },
          { label: 'Dog Leashes', url: `${SITE}/dogs/leashes/` },
          { label: 'Dog Breeds', url: `${SITE}/dog-breeds/` },
          { label: 'Resources', children: dogResources },
        ],
      },
      {
        label: 'Cats',
        url: `${SITE}/cats/`,
        children: [{ label: 'Cat Litter', url: `${SITE}/cats/litter/` }],
      },
    ],
  },
  {
    label: 'Animal Advocacy',
    url: `${SITE}/advocate/`,
    children: [
      { label: 'Animal Abuse', url: `${SITE}/advocate/animal-abuse/` },
      { label: 'Animal Laws', url: `${SITE}/advocate/laws/` },
      { label: 'Animal Rights', url: `${SITE}/advocate/animal-rights/` },
      { label: 'Animal Testing', url: `${SITE}/advocate/animal-testing/` },
      { label: 'How to Help', url: `${SITE}/how-to-help-animals/` },
    ],
  },
  { label: 'Facts & Stats', url: `${SITE}/statistics/` },
  { label: 'Our Campaigns', url: `${SITE}/campaign/` },
  { label: 'Store', url: `${SITE}/store/` },
  { label: 'About us', url: `${SITE}/about-us/` },
];

export const contact = {
  email: 'info@worldanimalfoundation.org',
  phone: '+1 315 203 2761',
  address: '1151 Walker Rd, Dover, Delaware, 19904',
  blurb:
    'World Animal Foundation is a digital platform for animal rights, responsible pet ownership and compassionate awareness.',
  disclaimer:
    'WAF is not a non-profit organization, and we neither accept nor solicit donations or charitable contributions.',
  copyright: 'Copyrights 2026. All Rights are Reserved. WorldAnimalFoundation.org',
  social: [
    { label: 'Twitter', icon: 'logo-twitter', url: 'https://twitter.com/worldanimalfdn' },
    { label: 'Facebook', icon: 'logo-facebook', url: 'https://www.facebook.com/WorldAnimalFdn' },
    {
      label: 'Instagram',
      icon: 'logo-instagram',
      url: 'https://www.instagram.com/worldanimalfoundation.waf/',
    },
    { label: 'YouTube', icon: 'logo-youtube', url: 'https://www.youtube.com/@WorldAnimalFdn' },
    {
      label: 'LinkedIn',
      icon: 'logo-linkedin',
      url: 'https://www.linkedin.com/company/world-animal-foundation-org/',
    },
  ] as const,
  policies: [
    { label: 'About us', url: `${SITE}/about-us/` },
    { label: 'Legal Disclaimer', url: `${SITE}/legal-disclaimer/` },
    { label: 'Earnings Disclaimer', url: `${SITE}/earnings-disclaimer/` },
    { label: 'Privacy Policy', url: `${SITE}/privacy-policy` },
    { label: 'Contact Us', url: `${SITE}/contact-us/` },
  ],
};
