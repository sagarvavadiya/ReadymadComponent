export const MenuItems = [
  {
    title: "Home",
  },
  {
    title: "Services",
    submenu: [
      {
        title: "web design",
      },
      {
        title: "web development",
        childSubmanu: [
          {
            title: "Frontend",
          },
          {
            title: "Backend",
            grandChildSubmanu: [
              {
                title: "NodeJS",
              },
              {
                title: "PHP",
              },
            ],
          },
        ],
      },
      {
        title: "SEO",
      },
    ],
  },
  {
    title: "About",
    submenu: [
      {
        title: "Who we are",
      },
      {
        title: "Our values",
      },
    ],
  },
];
