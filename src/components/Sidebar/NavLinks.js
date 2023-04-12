// sidebar nav links
export default {
  category1: [
    {
      "menu_title": "sidebar.overview",
      "menu_icon": "zmdi zmdi-info",
      "path": "/app/home",
      "new_item": false,
      "child_routes": null
    },
  ],
  category2: [
    {
      "menu_title": "sidebar.simulationHome",
      "menu_icon": "zmdi zmdi-home",
      "new_item": false,
      "path": "/app/simulation/home",
      "child_routes": null
    },
    {
      "menu_title": "sidebar.newSimulations",
      "menu_icon": "zmdi zmdi-plus-square",
      "new_item": false,
      "path": "/app/simulation/newsimulation",
      "child_routes": null
    },
    {
      "menu_title": "sidebar.simulationList",
      "menu_icon": "zmdi zmdi-view-list",
      "new_item": false,
      "type_multi": null,
      "child_routes": [
        {
          "menu_title": "sidebar.mySimulations",
          "menu_icon": "zmdi zmdi-view-list",
          "new_item": false,
          "path": "/app/simulation/mysimulation",
          "type_multi": null
        },
        {
          "menu_title": "sidebar.sharedSimulations",
          "menu_icon": "zmdi zmdi-view-list",
          "new_item": false,
          "path": "/app/simulation/sharedSimulations",
          "type_multi": null
        }
      ]
    },
    {
      "menu_title": "sidebar.simulate",
      "menu_icon": "zmdi zmdi-globe",
      "new_item": false,
      "path": "/app/simulation/simulate",
      "child_routes": null
    },
  ]
};
