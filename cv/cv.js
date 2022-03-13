const cv = {
  "longCV": false,
  "month_names": ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  "headline": {
    "name": "Mariano Gappa",
    "short": "Senior Software Engineer",
    "experience_start": "2010-03-01",
    "languages": [
      { "id": 1, "name": "English", "image": "images/gb.svg", "level": "(fluent)", "color": "white" },
      { "id": 2, "name": "Spanish", "image": "images/es.svg", "level": "(native)", "color": "white" },
      { "id": 3, "name": "Japanese", "image": "images/jp.svg", "level": "(JLPT N4)", "color": "white" }
    ],
    "links": [
      {
        "link": "mariano.gappa@gmail.com",
        "type": "Email"
      },
      {
        "link": "https://github.com/marianogappa",
        "type": "Github"
      },
      {
        "link": "http://marianogappa.github.io/",
        "type": "Blog"
      },
      {
        "link": "https://twitter.com/marianogappa",
        "type": "Twitter"
      }
    ],
    "current_location": { "text": "London, UK", "image": "images/uk.svg", "color": "white" },
    "born_location": { "text": "Buenos Aires, Argentina", "image": "images/ar.svg", "color": "white" },
    "expertise_bullets": [
      { "id": 1, "text": "Go", "color": "light_blue", "image": "images/gopher.svg" },
      { "id": 2, "text": "Python", "color": "red", "image": "images/python.svg" },
      { "id": 3, "text": "Databases", "color": "blue", "image": "images/mariadb.svg" },
      { "id": 4, "text": "AWS", "color": "yellow", "image": "images/aws.svg" },
      { "id": 5, "text": "Kubernetes", "color": "blue", "image": "images/kubernetes.svg" },
      { "id": 6, "text": "Microservices", "color": "white", "image": "" },
      { "id": 7, "text": "Kafka", "color": "blue", "image": "images/kafka.svg" },
    ],
    "interest_bullets": [
      { "id": 1, "text": "Machine Learning", "color": "white", "image": "" },
      { "id": 2, "text": "Rust", "color": "white", "image": "" },
      { "id": 3, "text": "Music Industry", "color": "white", "image": "" }
    ]
  },
  "open_source_projects": [
    {
      "name": "Crypto Predictions",
      "short": "accountability for social media predictions",
      "github": "https://github.com/marianogappa/crypto-predictions",
      "blogpost": "",
      "bullets": [
        "State machine-based engine for tracking crypto-related predictions on social media posts.",
      ],
      "stack": [
        { "id": 1, "text": "Go", "color": "light_blue", "image": "images/gopher.svg" },
        { "id": 2, "text": "Postgres", "color": "light_blue", "image": "images/postgres.svg" }
      ],
      "special": true
    },
    {
      "name": "Signal Checker",
      "short": "crypto signal fact-checking",
      "github": "https://github.com/marianogappa/signal-checker",
      "blogpost": "",
      "bullets": [
        "CLI tool, server & importable Go library to check the results of crypto signals against an exchange's historical data.",
      ],
      "stack": [
        { "id": 1, "text": "Go", "color": "light_blue", "image": "images/gopher.svg" },
      ],
      "special": true
    },
    {
      "name": "chart",
      "short": "quick & smart charting for STDIN",
      "github": "https://github.com/marianogappa/chart",
      "blogpost": "https://movio.co/en/blog/improving-with-sql-and-charts/",
      "bullets": [
        "CLI tool for easy ad-hoc charting of data piped from a terminal, opening a browser tab",
        "Reached 497 Github stars in May 2019; featured in <a href='https://golangweekly.com/issues/167'>Golang Weekly #167</a> and <a href='https://golangweekly.com/issues/222'>#222</a> ",
        "Squads at Movio use it for reports & ad-hoc charting; teams around the world have reported use-cases",
      ],
      "stack": [
        { "id": 1, "text": "Go", "color": "light_blue", "image": "images/gopher.svg" },
        { "id": 2, "text": "Javascript", "color": "yellow", "image": "images/javascript.png" }
      ]
    },
    {
      "type": "open_source_project",
      "name": "sql",
      "short": "MySQL & Postgres pipe",
      "github": "https://github.com/marianogappa/sql",
      "blogpost": "https://movio.co/en/blog/improving-with-sql-and-charts/",
      "bullets": [
        "CLI tool for integrating MySQL and the terminal, including concurrent querying of many databases",
        "Widely adopted within Movio for ad-hoc querying and used in combination with chart"
      ],
      "stack": [
        { "id": 1, "text": "Go", "color": "light_blue", "image": "images/gopher.svg" },
      ],
      "hidable": true
    },
    {
      "type": "open_source_project",
      "name": "ostinato",
      "short": "a chess library that runs on the server & the browser",
      "github": "https://github.com/marianogappa/ostinato",
      "blogpost": "https://marianogappa.github.io/software/2017/03/24/ostinato-a-chess-engine-written-in-scala-that-runs-on-the-browser-docker-and-the-repl/",
      "bullets": [
        "Feature-rich chess library cross-compiled for both server (Scala) and browser (ScalaJS)",
        "#1 Google result for Chess Notation Converter"
      ],
      "stack": [
        { "id": 1, "text": "Scala", "color": "red", "image": "images/scala.svg" },
        { "id": 2, "text": "Scala JS", "color": "red", "image": "images/scala.svg" },
        { "id": 3, "text": "Javascript", "color": "yellow", "image": "images/javascript.png" },
      ]
    },
    {
      "type": "open_source_project",
      "name": "flowbro",
      "short": "real-time flowchart visualisation for Kafka distributed systems",
      "github": "https://github.com/marianogappa/flowbro",
      "blogpost": "",
      "bullets": [
        "Allows devs to follow an FSM through a Kafka data pipeline based on multiple queues",
        "Requires only a JSON-based FSM configuration and broker address",
        "Used within Movio to monitor and support the company's main distributed system"
      ],
      "stack": [
        { "id": 1, "text": "Go", "color": "light_blue", "image": "images/gopher.svg" },
        { "id": 2, "text": "Javascript", "color": "yellow", "image": "images/javascript.png" }
      ],
      "hidable": true
    },
    {
      "type": "open_source_project",
      "name": "jira-cli",
      "short": "lightweight bash script for easily querying your company's JIRA issues",
      "github": "https://github.com/marianogappa/jira-cli",
      "blogpost": "http://marianogappa.github.io/software/2016/05/10/jira-cli/",
      "stack": [
        { "id": 1, "text": "Bash", "color": "black", "image": "images/bash.png" },
      ],
      "hidable": true
    },
    {
      "type": "open_source_project",
      "name": "sd",
      "short": "stream differ",
      "github": "https://github.com/marianogappa/sd",
      "blogpost": "http://marianogappa.github.io/software/2016/07/30/diffing-streams-on-the-terminal/",
      "stack": [
        { "id": 1, "text": "Go", "color": "light_blue", "image": "images/gopher.svg" },
      ],
      "hidable": true
    }
  ],
  "work_experience": [
    {
      "type": "work_experience",
      "role": "Software Engineer",
      "company": "Oaknorth",
      "country": "images/uk.svg",
      "company_link": "https://www.oaknorth.co.uk/",
      "started": "2021-01",
      "ended": "Present",
      "bullets": [
        "Implemented significant (up to 25x) performance improvements on critical features on their largest client that were timing out."
      ],
      "stack": [
        { "id": 1, "text": "Python", "color": "red", "image": "images/python.svg" },
        { "id": 2, "text": "Typescript", "color": "red", "image": "images/typescript.png" },
        { "id": 3, "text": "AWS", "color": "yellow", "image": "images/aws.svg" },
      ]
    },
    {
      "type": "work_experience",
      "role": "Software Engineer",
      "company": "Fat Llama",
      "country": "images/uk.svg",
      "company_link": "https://fatllama.com",
      "started": "2019-01",
      "ended": "2020-01",
      "bullets": [
        "Senior engineer taking the startup from Series A to Series B.",
        "Designed and implemented core business processes e.g. inventory, seller payouts, logistics integration, stateful microservices, optimised CI pipelines, partnerships integrations, payment platform test modes."
      ],
      "stack": [
        { "id": 1, "text": "Typescript", "color": "red", "image": "images/typescript.png" },
        { "id": 2, "text": "Go", "color": "red", "image": "images/gopher.svg" },
        { "id": 3, "text": "AWS", "color": "yellow", "image": "images/aws.svg" },
      ]
    },
    {
      "type": "work_experience",
      "role": "Software Engineer Squad Lead",
      "company": "Movio",
      "country": "images/nz.svg",
      "company_link": "https://movio.co/en/",
      "started": "2018-02",
      "ended": "2018-12",
      "bullets": ["Led the team that built Movio's Datawarehouse."],
      "stack": [
        { "id": 1, "text": "Spark", "color": "red", "image": "images/spark.png" },
        { "id": 2, "text": "Scala", "color": "red", "image": "images/scala.svg" },
        { "id": 3, "text": "AWS", "color": "yellow", "image": "images/aws.svg" },
      ]
    },
    {
      "type": "work_experience",
      "role": "Software Engineer",
      "company": "Movio",
      "country": "images/nz.svg",
      "company_link": "https://movio.co/en/",
      "started": "2013-09",
      "ended": "2018-01",
      "bullets": [
        "2017: led 3-person team that implemented service that <a href='http://marianogappa.github.io/software/2018/04/02/we-saved-50ky-with-a-tiny-go-µservice-coded-in-a-hackathon/'>saved $50k/yr in AWS cost and benchmarked 80% faster on avg</a>; blogpost peaking at <a href='http://hnrankings.info/16806388'>#2</a> on <a href='https://news.ycombinator.com/item?id=16806388'>Hacker News</a> & featured in <a href='https://golangweekly.com/issues/206'>Golang Weekly #206</a>",
        "2016: was key advocate and enabler for <a href='https://movio.co/en/blog/migrate-Scala-to-Go/'>migration from Scala to Go</a>, and from monolith to microservices; blogpost peaking at <a href='http://hnrankings.info/13476988'>#5</a> on <a href='https://news.ycombinator.com/item?id=13476988'>Hacker News</a>, and featured in <a href='http://golangweekly.com/issues/144'>Golang Weekly #144</a> & <a href='https://us2.campaign-archive.com/?u=ba834c562d82d9aba5eaf90ba&id=66b0dd9e86'>Scala Times #154</a>",
        "2015: formed 4-person team that implemented custom columnar database replication on top of MySQL",
        "2014: formed 3-person team that migrated large legacy product with new offering without downtime",
        "Authored open source tools currently being used by the engineers, and many teams around the world"
      ],
      "stack": [
        { "id": 1, "text": "Go", "color": "light_blue", "image": "images/gopher.svg" },
        { "id": 2, "text": "Scala", "color": "red", "image": "images/scala.svg" },
        { "id": 3, "text": "PHP", "color": "magenta", "image": "images/php.svg" },
        { "id": 4, "text": "MariaDB", "color": "blue", "image": "images/mariadb.svg" },
        { "id": 5, "text": "AWS", "color": "yellow", "image": "images/aws.svg" },
        { "id": 6, "text": "Kubernetes", "color": "blue", "image": "images/kubernetes.svg" },
        { "id": 7, "text": "Kafka", "color": "blue", "image": "images/kafka.svg" },
        { "id": 8, "text": "Cassandra", "color": "blue", "image": "images/cassandra.svg" },
      ],
      "special": true
    },
    {
      "type": "work_experience",
      "role": "Software Engineer",
      "company": "OLX",
      "country": "images/ar.svg",
      "company_link": "http://www.olx.in",
      "started": "2013-01",
      "ended": "2013-09",
      "bullets": [
        "Co-wrote Scala API for all mobile versions of the OLX app, which powers e.g. OLX India, Brazil, Nigeria.",
        "<a href='https://en.wikipedia.org/wiki/OLX#India'>\"OLX became the vernacular for 'selling' in India, in the form of [...] 'OLX it'.\"</a>"
      ],
      "stack": [
        { "id": 1, "text": "Scala", "color": "red", "image": "images/scala.svg" },
      ],
      "hidable": true
    },
    {
      "type": "work_experience",
      "role": "Software Engineer",
      "company": "Psicofxp S.A.",
      "country": "images/ar.svg",
      "started": "2012-08",
      "ended": "2012-11",
      "bullets": ["Co-designed a Pinterest-like project and maintained the #1 Argentinian forum (#1 by daily active users)"],
      "stack": [
        { "id": 1, "text": "PHP", "color": "magenta", "image": "images/php.svg" },
        { "id": 2, "text": "MySQL", "color": "orange", "image": "images/mysql.svg" },
      ],
      "hidable": true
    },
    {
      "type": "work_experience",
      "role": "Software Engineer",
      "company": "Rocket Internet GmbH",
      "country": "images/ar.svg",
      "company_link": "http://www.rocket-internet.de/",
      "started": "2012-03",
      "ended": "2012-06",
      "bullets": ["Implemented Rocket Internet e-commerce ventures throughout Latin America"],
      "stack": [
        { "id": 1, "text": "PHP", "color": "magenta", "image": "images/php.svg" },
        { "id": 2, "text": "MySQL", "color": "orange", "image": "images/mysql.svg" },
      ],
      "hidable": true
    },
    {
      "type": "work_experience",
      "role": "Software Engineer (freelance)",
      "country": "images/ar.svg",
      "started": "2011-09",
      "ended": "2012-03",
      "bullets": [
        "Various short-lived projects while focusing on engineering thesis"
      ],
      "stack": [
        { "id": 1, "text": "PHP", "color": "magenta", "image": "images/php.svg" },
        { "id": 2, "text": "MySQL", "color": "orange", "image": "images/mysql.svg" },
      ],
      "hidable": true
    },
    {
      "type": "work_experience",
      "role": "Software Engineer",
      "company": "Metrogames",
      "country": "images/ar.svg",
      "company_link": "http://www.metrogames.com/",
      "started": "2010-03",
      "ended": "2011-08",
      "bullets": [
        "Backend Developer Leader of <a href='https://www.facebook.com/cocogirl'>Coco Girl</a>, the last big Metrogames' game project (60+ people involved)"
      ],
      "stack": [
        { "id": 1, "text": "PHP", "color": "magenta", "image": "images/php.svg" },
        { "id": 2, "text": "MySQL", "color": "orange", "image": "images/mysql.svg" },
      ],
      "hidable": true
    },
    {
      "type": "work_experience",
      "role": "Software Developer",
      "company": "Casablanca Hardware Store Chain",
      "country": "images/ar.svg",
      "started": "2007-01",
      "ended": "2007-12",
      "bullets": ["Designed, implemented and maintained hardware store accounting and inventory system"],
      "stack": [
        { "id": 1, "text": "PHP", "color": "magenta", "image": "images/php.svg" },
        { "id": 2, "text": "MySQL", "color": "orange", "image": "images/mysql.svg" },
        { "id": 3, "text": "Javascript", "color": "yellow", "image": "images/javascript.png" },
      ],
      "hidable": true
    },
    {
      "type": "work_experience",
      "role": "Software Developer",
      "company": "AranaParera Real Estate",
      "country": "images/ar.svg",
      "started": "2006-01",
      "ended": "2006-12",
      "bullets": ["Designed, implemented and maintained real-estate website"],
      "stack": [
        { "id": 1, "text": "PHP", "color": "magenta", "image": "images/php.svg" },
        { "id": 2, "text": "MySQL", "color": "orange", "image": "images/mysql.svg" },
        { "id": 3, "text": "Javascript", "color": "yellow", "image": "images/javascript.png" },
      ],
      "hidable": true
    }
  ],
  "education": [
    {
      "type": "education",
      "name": "National Technological University (UTN-FRBA)",
      "short_description": "5-year Information Systems Engineering degree (<a href='https://en.wikipedia.org/wiki/Engineer&apos;s_degree#Latin_America'>equivalent to Master degree</a>)",
      "short_name": "<a href='https://www.frba.utn.edu.ar/en/home/'>UTN-FRBA</a>",
      "company_link": "https://www.frba.utn.edu.ar/en/home/",
      "title": "Information Systems Engineer degree (5 years)",
      "degree_type": "",
      "date_range": "2004-2011",
      "bullets": [
        "5-year Information Systems Engineering degree (<a href='https://en.wikipedia.org/wiki/Engineer&apos;s_degree#Latin_America'>equivalent to Master degree</a>)"
      ]
    }
  ],
  "finalMessage": "I've also studied Studio Mixing at <a href='https://en.wikipedia.org/wiki/Berklee_College_of_Music'>Berklee College of Music</a>, I'm co-authoring a Chess book and I'm learning Chinese."
}
