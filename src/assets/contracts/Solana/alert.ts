/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/alert_protocol.json`.
 */
export type AlertProtocol = {
  "address": "8a9Uup7MfuERSx9iLr99uS2WQQJ9QidTvc7QaVH9nwH3",
  "metadata": {
    "name": "alertProtocol",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "clockInDeadMansBreak",
      "discriminator": [
        192,
        228,
        188,
        5,
        16,
        199,
        9,
        120
      ],
      "accounts": [
        {
          "name": "ceo",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  108,
                  101,
                  114,
                  116,
                  80,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108,
                  67,
                  69,
                  79
                ]
              }
            ]
          }
        },
        {
          "name": "deadMansBreakAlert",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  97,
                  100,
                  77,
                  97,
                  110,
                  115,
                  66,
                  114,
                  101,
                  97,
                  107,
                  65,
                  108,
                  101,
                  114,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initializeAlertProtocol",
      "discriminator": [
        126,
        231,
        77,
        132,
        60,
        197,
        2,
        217
      ],
      "accounts": [
        {
          "name": "ceo",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  108,
                  101,
                  114,
                  116,
                  80,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108,
                  67,
                  69,
                  79
                ]
              }
            ]
          }
        },
        {
          "name": "deadMansBreakAlert",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  97,
                  100,
                  77,
                  97,
                  110,
                  115,
                  66,
                  114,
                  101,
                  97,
                  107,
                  65,
                  108,
                  101,
                  114,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "siteUpdateAlert",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  105,
                  116,
                  101,
                  85,
                  112,
                  100,
                  97,
                  116,
                  101,
                  65,
                  108,
                  101,
                  114,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "sitePsaAlert",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  105,
                  116,
                  101,
                  80,
                  83,
                  65,
                  65,
                  108,
                  101,
                  114,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "siteSosAlert",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  105,
                  116,
                  101,
                  83,
                  79,
                  83,
                  65,
                  108,
                  101,
                  114,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "passOnAlertProtocolCeo",
      "discriminator": [
        183,
        57,
        237,
        37,
        58,
        197,
        2,
        9
      ],
      "accounts": [
        {
          "name": "ceo",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  108,
                  101,
                  114,
                  116,
                  80,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108,
                  67,
                  69,
                  79
                ]
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "newCeoAddress",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "toggleSosAlert",
      "discriminator": [
        33,
        47,
        76,
        58,
        110,
        201,
        105,
        94
      ],
      "accounts": [
        {
          "name": "ceo",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  108,
                  101,
                  114,
                  116,
                  80,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108,
                  67,
                  69,
                  79
                ]
              }
            ]
          }
        },
        {
          "name": "siteSosAlert",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  105,
                  116,
                  101,
                  83,
                  79,
                  83,
                  65,
                  108,
                  101,
                  114,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "isEnabled",
          "type": "bool"
        }
      ]
    },
    {
      "name": "triggerNewPsaAlert",
      "discriminator": [
        190,
        103,
        232,
        142,
        22,
        254,
        24,
        43
      ],
      "accounts": [
        {
          "name": "ceo",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  108,
                  101,
                  114,
                  116,
                  80,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108,
                  67,
                  69,
                  79
                ]
              }
            ]
          }
        },
        {
          "name": "sitePsaAlert",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  105,
                  116,
                  101,
                  80,
                  83,
                  65,
                  65,
                  108,
                  101,
                  114,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "psaMsg",
          "type": "string"
        }
      ]
    },
    {
      "name": "triggerNewUiAvailableAlert",
      "discriminator": [
        50,
        19,
        235,
        177,
        0,
        234,
        166,
        37
      ],
      "accounts": [
        {
          "name": "ceo",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  108,
                  101,
                  114,
                  116,
                  80,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108,
                  67,
                  69,
                  79
                ]
              }
            ]
          }
        },
        {
          "name": "siteUpdateAlert",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  105,
                  116,
                  101,
                  85,
                  112,
                  100,
                  97,
                  116,
                  101,
                  65,
                  108,
                  101,
                  114,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "signer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ],
  "accounts": [
    {
      "name": "alertProtocolCeo",
      "discriminator": [
        117,
        23,
        200,
        75,
        138,
        242,
        219,
        226
      ]
    },
    {
      "name": "deadMansBreakAlert",
      "discriminator": [
        183,
        198,
        197,
        53,
        13,
        41,
        71,
        174
      ]
    },
    {
      "name": "sitePsaAlert",
      "discriminator": [
        84,
        220,
        218,
        23,
        196,
        70,
        163,
        220
      ]
    },
    {
      "name": "siteSosAlert",
      "discriminator": [
        16,
        73,
        44,
        206,
        201,
        9,
        226,
        36
      ]
    },
    {
      "name": "siteUpdateAlert",
      "discriminator": [
        209,
        193,
        104,
        36,
        120,
        100,
        98,
        25
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "msgTooLong",
      "msg": "Message can't be longer than 444 characters"
    }
  ],
  "types": [
    {
      "name": "alertProtocolCeo",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "address",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "deadMansBreakAlert",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "unixClockInTimeStamp",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "sitePsaAlert",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "sitePsaMsg",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "siteSosAlert",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "sosFlag",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "siteUpdateAlert",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "siteUpdateCount",
            "type": "u64"
          }
        ]
      }
    }
  ]
};
