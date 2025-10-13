/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/lending_protocol.json`.
 */
export type LendingProtocol = {
  "address": "HKaSjxcm2sdpmvrJeRsEDDZB93wDRdHcmFUS3hXxknV9",
  "metadata": {
    "name": "lendingProtocol",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "addTokenReserve",
      "discriminator": [
        250,
        206,
        252,
        83,
        142,
        196,
        249,
        76
      ],
      "accounts": [
        {
          "name": "tokenReserveStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  82,
                  101,
                  115,
                  101,
                  114,
                  118,
                  101,
                  83,
                  116,
                  97,
                  116,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "ceo",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
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
          "name": "tokenReserve",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  82,
                  101,
                  115,
                  101,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "tokenMintAddress"
              }
            ]
          }
        },
        {
          "name": "tokenReserveAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "tokenReserve"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "mint"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
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
          "name": "tokenMintAddress",
          "type": "pubkey"
        },
        {
          "name": "tokenDecimalAmount",
          "type": "u8"
        }
      ]
    },
    {
      "name": "createSubMarket",
      "discriminator": [
        107,
        180,
        190,
        239,
        115,
        148,
        6,
        8
      ],
      "accounts": [
        {
          "name": "subMarketStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  98,
                  77,
                  97,
                  114,
                  107,
                  101,
                  116,
                  83,
                  116,
                  97,
                  116,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "subMarket",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  98,
                  77,
                  97,
                  114,
                  107,
                  101,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "tokenMintAddress"
              },
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "arg",
                "path": "subMarketIndex"
              }
            ]
          }
        },
        {
          "name": "tokenReserve",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  82,
                  101,
                  115,
                  101,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "tokenMintAddress"
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
          "name": "tokenMintAddress",
          "type": "pubkey"
        },
        {
          "name": "subMarketIndex",
          "type": "u16"
        },
        {
          "name": "feeCollectorAddress",
          "type": "pubkey"
        },
        {
          "name": "feeOnInterestEarnedRate",
          "type": "u16"
        }
      ]
    },
    {
      "name": "depositTokens",
      "discriminator": [
        176,
        83,
        229,
        18,
        191,
        143,
        176,
        150
      ],
      "accounts": [
        {
          "name": "lendingProtocol",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  80,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "tokenReserve",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  82,
                  101,
                  115,
                  101,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "tokenMintAddress"
              }
            ]
          }
        },
        {
          "name": "lendingStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  83,
                  116,
                  97,
                  116,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "subMarket",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  98,
                  77,
                  97,
                  114,
                  107,
                  101,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "tokenMintAddress"
              },
              {
                "kind": "arg",
                "path": "subMarketOwnerAddress"
              },
              {
                "kind": "arg",
                "path": "subMarketIndex"
              }
            ]
          }
        },
        {
          "name": "userLendingAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  85,
                  115,
                  101,
                  114,
                  65,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "arg",
                "path": "userAccountIndex"
              }
            ]
          }
        },
        {
          "name": "lendingUserTabAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  85,
                  115,
                  101,
                  114,
                  84,
                  97,
                  98,
                  65,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "tokenMintAddress"
              },
              {
                "kind": "arg",
                "path": "subMarketOwnerAddress"
              },
              {
                "kind": "arg",
                "path": "subMarketIndex"
              },
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "arg",
                "path": "userAccountIndex"
              }
            ]
          }
        },
        {
          "name": "lendingUserYearlyTaxAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  85,
                  115,
                  101,
                  114,
                  89,
                  101,
                  97,
                  114,
                  108,
                  121,
                  84,
                  97,
                  120,
                  65,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "lending_protocol.current_tax_year",
                "account": "lendingProtocol"
              },
              {
                "kind": "arg",
                "path": "tokenMintAddress"
              },
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "arg",
                "path": "userAccountIndex"
              }
            ]
          }
        },
        {
          "name": "userAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "account",
                "path": "mint"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "tokenReserveAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "tokenReserve"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "arg",
                "path": "tokenMintAddress"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "mint"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "associatedTokenProgram",
          "address": "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
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
          "name": "tokenMintAddress",
          "type": "pubkey"
        },
        {
          "name": "subMarketOwnerAddress",
          "type": "pubkey"
        },
        {
          "name": "subMarketIndex",
          "type": "u16"
        },
        {
          "name": "userAccountIndex",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        },
        {
          "name": "accountName",
          "type": {
            "option": "string"
          }
        }
      ]
    },
    {
      "name": "editLendingUserAccountName",
      "discriminator": [
        228,
        149,
        125,
        32,
        181,
        178,
        8,
        34
      ],
      "accounts": [
        {
          "name": "lendingUserStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  85,
                  115,
                  101,
                  114,
                  83,
                  116,
                  97,
                  116,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "userLendingAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  85,
                  115,
                  101,
                  114,
                  65,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "arg",
                "path": "userAccountIndex"
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
          "name": "userAccountIndex",
          "type": "u8"
        },
        {
          "name": "accountName",
          "type": "string"
        }
      ]
    },
    {
      "name": "editSubMarket",
      "discriminator": [
        37,
        203,
        19,
        39,
        7,
        240,
        200,
        134
      ],
      "accounts": [
        {
          "name": "subMarketStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  98,
                  77,
                  97,
                  114,
                  107,
                  101,
                  116,
                  83,
                  116,
                  97,
                  116,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "subMarket",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  98,
                  77,
                  97,
                  114,
                  107,
                  101,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "tokenMintAddress"
              },
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "arg",
                "path": "subMarketIndex"
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
          "name": "tokenMintAddress",
          "type": "pubkey"
        },
        {
          "name": "subMarketIndex",
          "type": "u16"
        },
        {
          "name": "feeCollectorAddress",
          "type": "pubkey"
        },
        {
          "name": "feeOnInterestEarnedRate",
          "type": "u16"
        }
      ]
    },
    {
      "name": "initializeLendingProtocol",
      "discriminator": [
        240,
        31,
        249,
        106,
        15,
        7,
        89,
        125
      ],
      "accounts": [
        {
          "name": "lendingProtocol",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  80,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "ceo",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
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
          "name": "tokenReserveStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  82,
                  101,
                  115,
                  101,
                  114,
                  118,
                  101,
                  83,
                  116,
                  97,
                  116,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "subMarketStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  98,
                  77,
                  97,
                  114,
                  107,
                  101,
                  116,
                  83,
                  116,
                  97,
                  116,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "lendingStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  83,
                  116,
                  97,
                  116,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "lendingUserStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  85,
                  115,
                  101,
                  114,
                  83,
                  116,
                  97,
                  116,
                  115
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
          "name": "taxYear",
          "type": "u32"
        }
      ]
    },
    {
      "name": "passOnLendingProtocolCeo",
      "discriminator": [
        10,
        77,
        52,
        243,
        209,
        45,
        151,
        108
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
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
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
      "name": "repayTokens",
      "discriminator": [
        221,
        56,
        255,
        138,
        154,
        25,
        146,
        166
      ],
      "accounts": [
        {
          "name": "lendingProtocol",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  80,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "tokenReserve",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  82,
                  101,
                  115,
                  101,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "tokenMintAddress"
              }
            ]
          }
        },
        {
          "name": "lendingStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  83,
                  116,
                  97,
                  116,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "subMarket",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  98,
                  77,
                  97,
                  114,
                  107,
                  101,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "tokenMintAddress"
              },
              {
                "kind": "arg",
                "path": "subMarketOwnerAddress"
              },
              {
                "kind": "arg",
                "path": "subMarketIndex"
              }
            ]
          }
        },
        {
          "name": "userLendingAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  85,
                  115,
                  101,
                  114,
                  65,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "arg",
                "path": "userAccountIndex"
              }
            ]
          }
        },
        {
          "name": "lendingUserTabAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  85,
                  115,
                  101,
                  114,
                  84,
                  97,
                  98,
                  65,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "tokenMintAddress"
              },
              {
                "kind": "arg",
                "path": "subMarketOwnerAddress"
              },
              {
                "kind": "arg",
                "path": "subMarketIndex"
              },
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "arg",
                "path": "userAccountIndex"
              }
            ]
          }
        },
        {
          "name": "lendingUserYearlyTaxAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  85,
                  115,
                  101,
                  114,
                  89,
                  101,
                  97,
                  114,
                  108,
                  121,
                  84,
                  97,
                  120,
                  65,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "lending_protocol.current_tax_year",
                "account": "lendingProtocol"
              },
              {
                "kind": "arg",
                "path": "tokenMintAddress"
              },
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "arg",
                "path": "userAccountIndex"
              }
            ]
          }
        },
        {
          "name": "userAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "arg",
                "path": "tokenMintAddress"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "tokenReserveAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "tokenReserve"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "arg",
                "path": "tokenMintAddress"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
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
          "name": "tokenMintAddress",
          "type": "pubkey"
        },
        {
          "name": "subMarketOwnerAddress",
          "type": "pubkey"
        },
        {
          "name": "subMarketIndex",
          "type": "u16"
        },
        {
          "name": "userAccountIndex",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateCurrentTaxYear",
      "discriminator": [
        48,
        62,
        92,
        6,
        6,
        78,
        161,
        98
      ],
      "accounts": [
        {
          "name": "lendingProtocol",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  80,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "ceo",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
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
          "name": "taxYear",
          "type": "u32"
        }
      ]
    },
    {
      "name": "withdrawTokens",
      "discriminator": [
        2,
        4,
        225,
        61,
        19,
        182,
        106,
        170
      ],
      "accounts": [
        {
          "name": "lendingProtocol",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  80,
                  114,
                  111,
                  116,
                  111,
                  99,
                  111,
                  108
                ]
              }
            ]
          }
        },
        {
          "name": "tokenReserve",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  107,
                  101,
                  110,
                  82,
                  101,
                  115,
                  101,
                  114,
                  118,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "tokenMintAddress"
              }
            ]
          }
        },
        {
          "name": "lendingStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  83,
                  116,
                  97,
                  116,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "subMarket",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  98,
                  77,
                  97,
                  114,
                  107,
                  101,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "tokenMintAddress"
              },
              {
                "kind": "arg",
                "path": "subMarketOwnerAddress"
              },
              {
                "kind": "arg",
                "path": "subMarketIndex"
              }
            ]
          }
        },
        {
          "name": "userLendingAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  85,
                  115,
                  101,
                  114,
                  65,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "arg",
                "path": "userAccountIndex"
              }
            ]
          }
        },
        {
          "name": "lendingUserTabAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  85,
                  115,
                  101,
                  114,
                  84,
                  97,
                  98,
                  65,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "tokenMintAddress"
              },
              {
                "kind": "arg",
                "path": "subMarketOwnerAddress"
              },
              {
                "kind": "arg",
                "path": "subMarketIndex"
              },
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "arg",
                "path": "userAccountIndex"
              }
            ]
          }
        },
        {
          "name": "lendingUserYearlyTaxAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  110,
                  100,
                  105,
                  110,
                  103,
                  85,
                  115,
                  101,
                  114,
                  89,
                  101,
                  97,
                  114,
                  108,
                  121,
                  84,
                  97,
                  120,
                  65,
                  99,
                  99,
                  111,
                  117,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "lending_protocol.current_tax_year",
                "account": "lendingProtocol"
              },
              {
                "kind": "arg",
                "path": "tokenMintAddress"
              },
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "arg",
                "path": "userAccountIndex"
              }
            ]
          }
        },
        {
          "name": "userAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "arg",
                "path": "tokenMintAddress"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "tokenReserveAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "tokenReserve"
              },
              {
                "kind": "const",
                "value": [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ]
              },
              {
                "kind": "arg",
                "path": "tokenMintAddress"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ]
            }
          }
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
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
          "name": "tokenMintAddress",
          "type": "pubkey"
        },
        {
          "name": "subMarketOwnerAddress",
          "type": "pubkey"
        },
        {
          "name": "subMarketIndex",
          "type": "u16"
        },
        {
          "name": "userAccountIndex",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "lendingProtocol",
      "discriminator": [
        1,
        62,
        30,
        95,
        224,
        114,
        36,
        120
      ]
    },
    {
      "name": "lendingProtocolCeo",
      "discriminator": [
        23,
        34,
        44,
        112,
        183,
        6,
        176,
        76
      ]
    },
    {
      "name": "lendingStats",
      "discriminator": [
        250,
        238,
        79,
        115,
        70,
        13,
        50,
        83
      ]
    },
    {
      "name": "lendingUserAccount",
      "discriminator": [
        149,
        141,
        10,
        3,
        170,
        109,
        186,
        123
      ]
    },
    {
      "name": "lendingUserStats",
      "discriminator": [
        53,
        93,
        131,
        123,
        253,
        85,
        71,
        88
      ]
    },
    {
      "name": "lendingUserTabAccount",
      "discriminator": [
        86,
        109,
        108,
        214,
        125,
        233,
        55,
        195
      ]
    },
    {
      "name": "lendingUserYearlyTaxAccount",
      "discriminator": [
        5,
        84,
        181,
        85,
        253,
        128,
        185,
        240
      ]
    },
    {
      "name": "subMarket",
      "discriminator": [
        8,
        252,
        85,
        11,
        98,
        87,
        166,
        169
      ]
    },
    {
      "name": "subMarketStats",
      "discriminator": [
        214,
        246,
        166,
        81,
        124,
        2,
        88,
        8
      ]
    },
    {
      "name": "tokenReserve",
      "discriminator": [
        21,
        18,
        59,
        135,
        120,
        20,
        31,
        12
      ]
    },
    {
      "name": "tokenReserveStats",
      "discriminator": [
        35,
        50,
        43,
        71,
        66,
        105,
        104,
        128
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidFeeRate",
      "msg": "The fee on interest earned rate can't be greater than 100%"
    },
    {
      "code": 6001,
      "name": "insufficientFunds",
      "msg": "You can't withdraw more funds than you've deposited or an amount that would expose you to liquidation on purpose"
    },
    {
      "code": 6002,
      "name": "incorrectNumberOfTabAccounts",
      "msg": "You must provide all of the sub user's tab accounts"
    },
    {
      "code": 6003,
      "name": "incorrectOrderOfTabAccounts",
      "msg": "You must provide the sub user's tab accounts ordered by user_tab_account_index"
    },
    {
      "code": 6004,
      "name": "unexpectedTabAccount",
      "msg": "Unexpected Tab Account PDA detected. Feed in only legitimate PDA's ordered by user_tab_account_index"
    },
    {
      "code": 6005,
      "name": "lendingUserAccountNameTooLong",
      "msg": "Lending User Account name can't be longer than 25 characters"
    }
  ],
  "types": [
    {
      "name": "lendingProtocol",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "currentTaxYear",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "lendingProtocolCeo",
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
      "name": "lendingStats",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "deposits",
            "type": "u128"
          },
          {
            "name": "withdrawals",
            "type": "u128"
          },
          {
            "name": "repayments",
            "type": "u128"
          },
          {
            "name": "liquidations",
            "type": "u128"
          },
          {
            "name": "swaps",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "lendingUserAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "userAccountIndex",
            "type": "u8"
          },
          {
            "name": "accountName",
            "type": "string"
          },
          {
            "name": "lendingUserAccountAdded",
            "type": "bool"
          },
          {
            "name": "tabAccountCount",
            "type": "u32"
          },
          {
            "name": "interestAccrued",
            "type": "u128"
          },
          {
            "name": "debtRepaid",
            "type": "u128"
          },
          {
            "name": "amountLiquidated",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "lendingUserStats",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "nameChangeCount",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "lendingUserTabAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "userAccountIndex",
            "type": "u8"
          },
          {
            "name": "tokenMintAddress",
            "type": "pubkey"
          },
          {
            "name": "subMarketOwnerAddress",
            "type": "pubkey"
          },
          {
            "name": "subMarketIndex",
            "type": "u16"
          },
          {
            "name": "userTabAccountIndex",
            "type": "u32"
          },
          {
            "name": "userTabAccountAdded",
            "type": "bool"
          },
          {
            "name": "depositedAmount",
            "type": "u128"
          },
          {
            "name": "borrowedAmount",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "lendingUserYearlyTaxAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "userAccountIndex",
            "type": "u8"
          },
          {
            "name": "tokenMintAddress",
            "type": "pubkey"
          },
          {
            "name": "taxYear",
            "type": "u32"
          },
          {
            "name": "yearlyTaxAccountAdded",
            "type": "bool"
          },
          {
            "name": "lastActivityType",
            "type": "u8"
          },
          {
            "name": "lastLendingActivityTimeStamp",
            "type": "u64"
          },
          {
            "name": "interestAccrued",
            "type": "u128"
          },
          {
            "name": "debtRepaid",
            "type": "u128"
          },
          {
            "name": "amountLiquidated",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "subMarket",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u32"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "tokenMintAddress",
            "type": "pubkey"
          },
          {
            "name": "subMarketIndex",
            "type": "u16"
          },
          {
            "name": "feeCollectorAddress",
            "type": "pubkey"
          },
          {
            "name": "feeOnInterestEarnedRate",
            "type": "u16"
          },
          {
            "name": "depositedAmount",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "subMarketStats",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "subMarketCreationCount",
            "type": "u32"
          },
          {
            "name": "subMarketEditCount",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "tokenReserve",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenReserveProtocolIndex",
            "type": "u32"
          },
          {
            "name": "tokenMintAddress",
            "type": "pubkey"
          },
          {
            "name": "tokenDecimalAmount",
            "type": "u8"
          },
          {
            "name": "depositedAmount",
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "tokenReserveStats",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenReserveCount",
            "type": "u32"
          }
        ]
      }
    }
  ]
}