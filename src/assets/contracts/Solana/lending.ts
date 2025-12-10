/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/lending_protocol.json`.
 */
export type LendingProtocol = {
  "address": "9Lfsu1wKX7cpoGjeSParPZdTfvH8j3UdfVsoNMg51AaU",
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
        },
        {
          "name": "pythPriceUpdateKey",
          "type": "pubkey"
        },
        {
          "name": "borrowApy",
          "type": "u16"
        },
        {
          "name": "globalLimit",
          "type": "u128"
        }
      ]
    },
    {
      "name": "borrowTokens",
      "discriminator": [
        98,
        145,
        18,
        209,
        129,
        98,
        215,
        25
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
          "name": "lendingUserMonthlyStatementAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  77,
                  111,
                  110,
                  116,
                  104,
                  108,
                  121,
                  83,
                  116,
                  97,
                  116,
                  101,
                  109,
                  101,
                  110,
                  116,
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
                "path": "lending_protocol.current_statement_month",
                "account": "lendingProtocol"
              },
              {
                "kind": "account",
                "path": "lending_protocol.current_statement_year",
                "account": "lendingProtocol"
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
        }
      ]
    },
    {
      "name": "claimSubMarketFees",
      "discriminator": [
        243,
        212,
        85,
        201,
        212,
        111,
        7,
        101
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
          "name": "lendingUserMonthlyStatementAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  77,
                  111,
                  110,
                  116,
                  104,
                  108,
                  121,
                  83,
                  116,
                  97,
                  116,
                  101,
                  109,
                  101,
                  110,
                  116,
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
                "path": "lending_protocol.current_statement_month",
                "account": "lendingProtocol"
              },
              {
                "kind": "account",
                "path": "lending_protocol.current_statement_year",
                "account": "lendingProtocol"
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
          "name": "lendingUserMonthlyStatementAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  77,
                  111,
                  110,
                  116,
                  104,
                  108,
                  121,
                  83,
                  116,
                  97,
                  116,
                  101,
                  109,
                  101,
                  110,
                  116,
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
                "path": "lending_protocol.current_statement_month",
                "account": "lendingProtocol"
              },
              {
                "kind": "account",
                "path": "lending_protocol.current_statement_year",
                "account": "lendingProtocol"
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
          "name": "statementMonth",
          "type": "u8"
        },
        {
          "name": "statementYear",
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
          "name": "lendingUserMonthlyStatementAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  77,
                  111,
                  110,
                  116,
                  104,
                  108,
                  121,
                  83,
                  116,
                  97,
                  116,
                  101,
                  109,
                  101,
                  110,
                  116,
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
                "path": "lending_protocol.current_statement_month",
                "account": "lendingProtocol"
              },
              {
                "kind": "account",
                "path": "lending_protocol.current_statement_year",
                "account": "lendingProtocol"
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
        },
        {
          "name": "payOffLoan",
          "type": "bool"
        }
      ]
    },
    {
      "name": "updateCurrentStatementMonthAndYear",
      "discriminator": [
        83,
        0,
        245,
        197,
        247,
        149,
        59,
        55
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
          "name": "statementMonth",
          "type": "u8"
        },
        {
          "name": "statementYear",
          "type": "u32"
        }
      ]
    },
    {
      "name": "updateTokenReserve",
      "discriminator": [
        4,
        133,
        52,
        158,
        128,
        235,
        127,
        213
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
          "name": "borrowApy",
          "type": "u16"
        },
        {
          "name": "globalLimit",
          "type": "u128"
        }
      ]
    },
    {
      "name": "updateUserSnapShot",
      "discriminator": [
        21,
        162,
        16,
        185,
        73,
        133,
        41,
        114
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
          "name": "lendingUserMonthlyStatementAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  77,
                  111,
                  110,
                  116,
                  104,
                  108,
                  121,
                  83,
                  116,
                  97,
                  116,
                  101,
                  109,
                  101,
                  110,
                  116,
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
                "path": "lending_protocol.current_statement_month",
                "account": "lendingProtocol"
              },
              {
                "kind": "account",
                "path": "lending_protocol.current_statement_year",
                "account": "lendingProtocol"
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
          "name": "lendingUserMonthlyStatementAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114,
                  77,
                  111,
                  110,
                  116,
                  104,
                  108,
                  121,
                  83,
                  116,
                  97,
                  116,
                  101,
                  109,
                  101,
                  110,
                  116,
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
                "path": "lending_protocol.current_statement_month",
                "account": "lendingProtocol"
              },
              {
                "kind": "account",
                "path": "lending_protocol.current_statement_year",
                "account": "lendingProtocol"
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
      "name": "lendingUserMonthlyStatementAccount",
      "discriminator": [
        156,
        110,
        92,
        141,
        83,
        104,
        195,
        161
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
      "name": "stalePriceData",
      "msg": "The price data was stale"
    },
    {
      "code": 6001,
      "name": "staleSnapShotData",
      "msg": "The Lending User Snap Shot data was stale"
    },
    {
      "code": 6002,
      "name": "liquidationExposure",
      "msg": "You can't withdraw or borrow an amount that would cause your borrow liabilities to exceed 70% of deposited collateral"
    },
    {
      "code": 6003,
      "name": "insufficientFunds",
      "msg": "You can't withdraw more funds than you've deposited"
    },
    {
      "code": 6004,
      "name": "insufficientLiquidity",
      "msg": "Not enough liquidity in the Token Reserve for this withdraw or borrow"
    },
    {
      "code": 6005,
      "name": "tooManyFunds",
      "msg": "You can't pay back more funds than you've borrowed"
    }
  ],
  "types": [
    {
      "name": "lendingProtocol",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "currentStatementMonth",
            "type": "u8"
          },
          {
            "name": "currentStatementYear",
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
            "name": "borrows",
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
            "name": "snapShots",
            "type": "u128"
          },
          {
            "name": "feeCollections",
            "type": "u128"
          },
          {
            "name": "collateralSwaps",
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
          }
        ]
      }
    },
    {
      "name": "lendingUserMonthlyStatementAccount",
      "type": {
        "kind": "struct",
        "fields": [
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
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "userAccountIndex",
            "type": "u8"
          },
          {
            "name": "statementMonth",
            "type": "u8"
          },
          {
            "name": "statementYear",
            "type": "u32"
          },
          {
            "name": "monthlyStatementAccountAdded",
            "type": "bool"
          },
          {
            "name": "snapShotBalanceAmount",
            "type": "u128"
          },
          {
            "name": "snapShotInterestEarnedAmount",
            "type": "u128"
          },
          {
            "name": "snapShotFeesGeneratedAmount",
            "type": "u128"
          },
          {
            "name": "snapShotFeesCollectedAmount",
            "type": "u128"
          },
          {
            "name": "snapShotDebtAmount",
            "type": "u128"
          },
          {
            "name": "snapShotInterestAccruedAmount",
            "type": "u128"
          },
          {
            "name": "snapShotRepaidDebtAmount",
            "type": "u128"
          },
          {
            "name": "snapShotUserWasLiquidatedAmount",
            "type": "u128"
          },
          {
            "name": "monthlyDepositedAmount",
            "type": "u128"
          },
          {
            "name": "monthlyInterestEarnedAmount",
            "type": "u128"
          },
          {
            "name": "monthlyFeesGeneratedAmount",
            "type": "u128"
          },
          {
            "name": "monthlyFeesCollectedAmount",
            "type": "u128"
          },
          {
            "name": "monthlyWithdrawalAmount",
            "type": "u128"
          },
          {
            "name": "monthlyBorrowedAmount",
            "type": "u128"
          },
          {
            "name": "monthlyInterestAccruedAmount",
            "type": "u128"
          },
          {
            "name": "monthlyRepaidDebtAmount",
            "type": "u128"
          },
          {
            "name": "monthlyUserWasLiquidatedAmount",
            "type": "u128"
          },
          {
            "name": "lastLendingActivityAmount",
            "type": "u128"
          },
          {
            "name": "lastLendingActivityType",
            "type": "u8"
          },
          {
            "name": "lastLendingActivityTimeStamp",
            "type": "u64"
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
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "userAccountIndex",
            "type": "u8"
          },
          {
            "name": "pythPriceUpdateKey",
            "type": "pubkey"
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
            "name": "interestChangeIndex",
            "type": "u128"
          },
          {
            "name": "depositedAmount",
            "type": "u128"
          },
          {
            "name": "interestEarnedAmount",
            "type": "u128"
          },
          {
            "name": "feesGeneratedAmount",
            "type": "u128"
          },
          {
            "name": "feesCollectedAmount",
            "type": "u128"
          },
          {
            "name": "borrowedAmount",
            "type": "u128"
          },
          {
            "name": "interestAccruedAmount",
            "type": "u128"
          },
          {
            "name": "repaidDebtAmount",
            "type": "u128"
          },
          {
            "name": "userWasLiquidatedAmount",
            "type": "u128"
          },
          {
            "name": "interestChangeLastUpdatedTimeStamp",
            "type": "u64"
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
          },
          {
            "name": "interestEarnedAmount",
            "type": "u128"
          },
          {
            "name": "feesGeneratedAmount",
            "type": "u128"
          },
          {
            "name": "uncollectedFeesAmount",
            "type": "u128"
          },
          {
            "name": "borrowedAmount",
            "type": "u128"
          },
          {
            "name": "interestAccruedAmount",
            "type": "u128"
          },
          {
            "name": "repaidDebtAmount",
            "type": "u128"
          },
          {
            "name": "liquidatedAmount",
            "type": "u128"
          },
          {
            "name": "lastLendingActivityAmount",
            "type": "u128"
          },
          {
            "name": "lastLendingActivityType",
            "type": "u8"
          },
          {
            "name": "lastLendingActivityTimeStamp",
            "type": "u64"
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
            "name": "pythPriceUpdateKey",
            "type": "pubkey"
          },
          {
            "name": "supplyApy",
            "type": "u128"
          },
          {
            "name": "borrowApy",
            "type": "u16"
          },
          {
            "name": "utilizationRate",
            "type": "u64"
          },
          {
            "name": "globalLimit",
            "type": "u128"
          },
          {
            "name": "interestChangeIndex",
            "type": "u128"
          },
          {
            "name": "depositedAmount",
            "type": "u128"
          },
          {
            "name": "interestEarnedAmount",
            "type": "u128"
          },
          {
            "name": "feesGeneratedAmount",
            "type": "u128"
          },
          {
            "name": "borrowedAmount",
            "type": "u128"
          },
          {
            "name": "interestAccruedAmount",
            "type": "u128"
          },
          {
            "name": "repaidDebtAmount",
            "type": "u128"
          },
          {
            "name": "liquidatedAmount",
            "type": "u128"
          },
          {
            "name": "lastLendingActivityAmount",
            "type": "u128"
          },
          {
            "name": "lastLendingActivityType",
            "type": "u8"
          },
          {
            "name": "lastLendingActivityTimeStamp",
            "type": "u64"
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
          },
          {
            "name": "tokenReservesUpdatedCount",
            "type": "u128"
          }
        ]
      }
    }
  ]
};