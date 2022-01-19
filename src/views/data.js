const itemsDriveD = [{
  id: '31',
  name: '성장로 111 [Machine001]',
  icon: 'asset',
  isDirectory: true,
  expanded: true,
  items: [ {
    id: '32',
    name: '성장로 111 진동센서 [sensorMachine001]',
    icon: 'asset',
    isDirectory: true,
    expanded: true,
    items: [ {
      id: '33',
      name: 'Power_Controller(MainHeater) SV',
      icon: 'tag',
      isDirectory: false
    }, {
      id: '34',
      name: 'Power_Controller(MainHeater) PV',
      icon: 'tag',
      isDirectory: false
    }
    ]
  }, {
    id: '35',
    name: 'Total_Weight',
    icon: 'tag',
    isDirectory: false
  }, {
    id: '36',
    name: 'S/L_Move_Mode',
    icon: 'tag',
    isDirectory: false
  }, {
    id: '37',
    name: 'Seq_Start_Date(month)',
    icon: 'tag',
    isDirectory: false
  }
  ],
}, {
  id: '38',
  name: '성장로 112 [Machine002]',
  icon: 'asset',
  isDirectory: true,
  expanded: true,
  items: [ {
    id: '39',
    name: 'grow_Start_Date(month)',
    icon: 'tag',
    isDirectory: false
  }, {
    id: '310',
    name: 'Power_Controller(Bottom)_OUT',
    icon: 'tag',
    isDirectory: false
  }
  ]
}, {
  id: '311',
  name: '성장로 003 [Machine003]',
  isDirectory: true,
  icon: 'asset',
  expanded: true,
  items: [ {
    id: '312',
    name: 'Reminder(sec)',
    icon: 'tag',
    isDirectory: false
  }, {
    id: '313',
    name: 'Power_Controller(Main)_PV',
    icon: 'tag',
    isDirectory: false
  }
  ]
}
];

const itemsDriveC = [{
  id: '1',
  name: '성장로 001 [Machine001]',
  icon: 'asset',
  isDirectory: true,
  expanded: true,
  items: [ {
    id: '2',
    name: '성장로 001 진동센서 [sensorMachine001]',
    icon: 'asset',
    isDirectory: true,
    expanded: true,
    items: [ {
      id: '3',
      name: 'Power_Controller(MainHeater) SV',
      icon: 'tag',
      isDirectory: false
    }, {
      id: '4',
      name: 'Power_Controller(MainHeater) PV',
      icon: 'tag',
      isDirectory: false
    }
    ]
  }, {
    id: '5',
    name: 'Total_Weight',
    icon: 'tag',
    isDirectory: false
  }, {
    id: '6',
    name: 'S/L_Move_Mode',
    icon: 'tag',
    isDirectory: false
  }, {
    id: '7',
    name: 'Seq_Start_Date(month)',
    icon: 'tag',
    isDirectory: false
  }
  ],
}, {
  id: '8',
  name: '성장로 002 [Machine002]',
  icon: 'asset',
  isDirectory: true,
  expanded: true,
  items: [ {
    id: '9',
    name: 'grow_Start_Date(month)',
    icon: 'tag',
    isDirectory: false
  }, {
    id: '10',
    name: 'Power_Controller(Bottom)_OUT',
    icon: 'tag',
    isDirectory: false
  }
  ]
}, {
  id: '11',
  name: '성장로 003 [Machine003]',
  isDirectory: true,
  icon: 'asset',
  expanded: true,
  items: [ {
    id: '12',
    name: 'Reminder(sec)',
    icon: 'tag',
    isDirectory: false
  }, {
    id: '13',
    name: 'Power_Controller(Main)_PV',
    icon: 'tag',
    isDirectory: false
  }
  ]
}, {
  id: '14',
  name: '성장로 004 [Machine004]',
  icon: 'asset',
  isDirectory: false
}, {
  id: '15',
  name: '성장로 005 [Machine005]',
  icon: 'asset',
  isDirectory: false
}];

export default {
  getItemsDriveC() {
    return itemsDriveC;
  },
  getItemsDriveD() {
    return itemsDriveD;
  }
};
