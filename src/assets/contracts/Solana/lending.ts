/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/lending_protocol.json`.
 */
export type LendingProtocol = {
  "address": "2RYYqg5qpA5NWCn7gb9iobaDr6zmhn2XdLtTXdBGr4qh",
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
                "kind": "account",
                "path": "tokenMint"
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
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "tokenMint"
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
          "name": "tokenMint"
        },
        {
          "name": "tokenProgram"
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
          "name": "tokenDecimalAmount",
          "type": "u8"
        },
        {
          "name": "fixedBorrowApy",
          "type": "u16"
        },
        {
          "name": "useFixedBorrowApy",
          "type": "bool"
        },
        {
          "name": "globalLimit",
          "type": "u128"
        },
        {
          "name": "solvencyInsuranceFeeRate",
          "type": "u16"
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
          "name": "subMarketOwner"
        },
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
          "name": "priceValidator",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  97,
                  99,
                  108,
                  101,
                  80,
                  114,
                  105,
                  99,
                  101,
                  86,
                  97,
                  108,
                  105,
                  100,
                  97,
                  116,
                  111,
                  114
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
                "kind": "account",
                "path": "tokenMint"
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
                "kind": "account",
                "path": "token_reserve.token_id",
                "account": "tokenReserve"
              },
              {
                "kind": "account",
                "path": "subMarketOwner"
              },
              {
                "kind": "arg",
                "path": "subMarketIndex"
              }
            ]
          }
        },
        {
          "name": "lendingUserAccount",
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
                "kind": "account",
                "path": "token_reserve.token_id",
                "account": "tokenReserve"
              },
              {
                "kind": "account",
                "path": "subMarketOwner"
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
                "kind": "account",
                "path": "token_reserve.token_id",
                "account": "tokenReserve"
              },
              {
                "kind": "account",
                "path": "subMarketOwner"
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
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "tokenMint"
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
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "tokenMint"
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
          "name": "tokenMint"
        },
        {
          "name": "tokenProgram"
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
      "name": "claimLiquidationFees",
      "discriminator": [
        121,
        4,
        241,
        20,
        195,
        85,
        146,
        219
      ],
      "accounts": [
        {
          "name": "tokenMintAddress"
        },
        {
          "name": "subMarketOwner"
        },
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
          "name": "liquidationTreasurer",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  113,
                  117,
                  105,
                  100,
                  97,
                  116,
                  105,
                  111,
                  110,
                  84,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  101,
                  114
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
                "kind": "account",
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
                "kind": "account",
                "path": "token_reserve.token_id",
                "account": "tokenReserve"
              },
              {
                "kind": "account",
                "path": "subMarketOwner"
              },
              {
                "kind": "arg",
                "path": "subMarketIndex"
              }
            ]
          }
        },
        {
          "name": "lendingUserAccount",
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
                "kind": "account",
                "path": "token_reserve.token_id",
                "account": "tokenReserve"
              },
              {
                "kind": "account",
                "path": "subMarketOwner"
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
                "kind": "account",
                "path": "token_reserve.token_id",
                "account": "tokenReserve"
              },
              {
                "kind": "account",
                "path": "subMarketOwner"
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
          "name": "subMarketIndex",
          "type": "u16"
        },
        {
          "name": "userAccountIndex",
          "type": "u8"
        },
        {
          "name": "accountName",
          "type": {
            "option": "string"
          }
        },
        {
          "name": "lookUpTableAddress",
          "type": {
            "option": "pubkey"
          }
        }
      ]
    },
    {
      "name": "claimSolvencyInsuranceFees",
      "discriminator": [
        160,
        162,
        227,
        213,
        169,
        197,
        236,
        88
      ],
      "accounts": [
        {
          "name": "subMarketOwner"
        },
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
          "name": "solvencyTreasurer",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  111,
                  108,
                  118,
                  101,
                  110,
                  99,
                  121,
                  84,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  101,
                  114
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
                "kind": "account",
                "path": "tokenMint"
              }
            ]
          }
        },
        {
          "name": "lendingUserAccount",
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
                "kind": "account",
                "path": "token_reserve.token_id",
                "account": "tokenReserve"
              },
              {
                "kind": "account",
                "path": "subMarketOwner"
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
                "kind": "account",
                "path": "token_reserve.token_id",
                "account": "tokenReserve"
              },
              {
                "kind": "account",
                "path": "subMarketOwner"
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
          "name": "treasurerAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "tokenMint"
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
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "tokenMint"
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
          "name": "tokenMint"
        },
        {
          "name": "tokenProgram"
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
          "name": "subMarketIndex",
          "type": "u16"
        },
        {
          "name": "userAccountIndex",
          "type": "u8"
        },
        {
          "name": "accountName",
          "type": {
            "option": "string"
          }
        },
        {
          "name": "lookUpTableAddress",
          "type": {
            "option": "pubkey"
          }
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
          "name": "tokenMintAddress"
        },
        {
          "name": "subMarketOwner"
        },
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
                "kind": "account",
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
                "kind": "account",
                "path": "token_reserve.token_id",
                "account": "tokenReserve"
              },
              {
                "kind": "account",
                "path": "subMarketOwner"
              },
              {
                "kind": "arg",
                "path": "subMarketIndex"
              }
            ]
          }
        },
        {
          "name": "lendingUserAccount",
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
                "kind": "account",
                "path": "token_reserve.token_id",
                "account": "tokenReserve"
              },
              {
                "kind": "account",
                "path": "subMarketOwner"
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
                "kind": "account",
                "path": "token_reserve.token_id",
                "account": "tokenReserve"
              },
              {
                "kind": "account",
                "path": "subMarketOwner"
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
          "name": "subMarketIndex",
          "type": "u16"
        },
        {
          "name": "userAccountIndex",
          "type": "u8"
        },
        {
          "name": "accountName",
          "type": {
            "option": "string"
          }
        },
        {
          "name": "lookUpTableAddress",
          "type": {
            "option": "pubkey"
          }
        }
      ]
    },
    {
      "name": "claimSubMarketFeesAndDepositInDifferentSubMarket",
      "discriminator": [
        154,
        218,
        242,
        119,
        79,
        84,
        251,
        147
      ],
      "accounts": [
        {
          "name": "tokenMintAddress"
        },
        {
          "name": "initialSubMarketOwner"
        },
        {
          "name": "destinationSubMarketOwner"
        },
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
                "kind": "account",
                "path": "tokenMintAddress"
              }
            ]
          }
        },
        {
          "name": "initialSubMarket",
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
                "kind": "account",
                "path": "token_reserve.token_id",
                "account": "tokenReserve"
              },
              {
                "kind": "account",
                "path": "initialSubMarketOwner"
              },
              {
                "kind": "arg",
                "path": "initialSubMarketIndex"
              }
            ]
          }
        },
        {
          "name": "destinationSubMarket",
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
                "kind": "account",
                "path": "token_reserve.token_id",
                "account": "tokenReserve"
              },
              {
                "kind": "account",
                "path": "destinationSubMarketOwner"
              },
              {
                "kind": "arg",
                "path": "destinationSubMarketIndex"
              }
            ]
          }
        },
        {
          "name": "lendingUserAccount",
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
          "name": "initialLendingUserTabAccount",
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
                "kind": "account",
                "path": "token_reserve.token_id",
                "account": "tokenReserve"
              },
              {
                "kind": "account",
                "path": "initialSubMarketOwner"
              },
              {
                "kind": "arg",
                "path": "initialSubMarketIndex"
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
          "name": "destinationLendingUserTabAccount",
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
                "kind": "account",
                "path": "token_reserve.token_id",
                "account": "tokenReserve"
              },
              {
                "kind": "account",
                "path": "destinationSubMarketOwner"
              },
              {
                "kind": "arg",
                "path": "destinationSubMarketIndex"
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
          "name": "initialLendingUserMonthlyStatementAccount",
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
                "kind": "account",
                "path": "token_reserve.token_id",
                "account": "tokenReserve"
              },
              {
                "kind": "account",
                "path": "initialSubMarketOwner"
              },
              {
                "kind": "arg",
                "path": "initialSubMarketIndex"
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
          "name": "destinationLendingUserMonthlyStatementAccount",
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
                "kind": "account",
                "path": "token_reserve.token_id",
                "account": "tokenReserve"
              },
              {
                "kind": "account",
                "path": "destinationSubMarketOwner"
              },
              {
                "kind": "arg",
                "path": "destinationSubMarketIndex"
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
          "name": "initialSubMarketIndex",
          "type": "u16"
        },
        {
          "name": "destinationSubMarketIndex",
          "type": "u16"
        },
        {
          "name": "userAccountIndex",
          "type": "u8"
        },
        {
          "name": "accountName",
          "type": {
            "option": "string"
          }
        },
        {
          "name": "lookUpTableAddress",
          "type": {
            "option": "pubkey"
          }
        }
      ]
    },
    {
      "name": "createNewMonthlyStatement",
      "discriminator": [
        164,
        45,
        226,
        165,
        49,
        38,
        157,
        93
      ],
      "accounts": [
        {
          "name": "subMarketOwner"
        },
        {
          "name": "lendingUserOwner"
        },
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
          "name": "lendingUserTabAccount",
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
                "path": "tokenId"
              },
              {
                "kind": "account",
                "path": "subMarketOwner"
              },
              {
                "kind": "arg",
                "path": "subMarketIndex"
              },
              {
                "kind": "account",
                "path": "lendingUserOwner"
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
                "path": "tokenId"
              },
              {
                "kind": "account",
                "path": "subMarketOwner"
              },
              {
                "kind": "arg",
                "path": "subMarketIndex"
              },
              {
                "kind": "account",
                "path": "lendingUserOwner"
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
          "name": "tokenId",
          "type": "u8"
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
          "name": "tokenMintAddress"
        },
        {
          "name": "feeCollectorAddress"
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
                "kind": "account",
                "path": "token_reserve.token_id",
                "account": "tokenReserve"
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
          "name": "subMarketOwnerLookUpTable",
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
                  79,
                  119,
                  110,
                  101,
                  114,
                  76,
                  111,
                  111,
                  107,
                  85,
                  112,
                  84,
                  97,
                  98,
                  108,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "signer"
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
                "kind": "account",
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
          "name": "subMarketIndex",
          "type": "u16"
        },
        {
          "name": "feeOnInterestEarnedRate",
          "type": "u16"
        },
        {
          "name": "lookUpTableAddress",
          "type": {
            "option": "pubkey"
          }
        }
      ]
    },
    {
      "name": "createTempOraclePriceData",
      "discriminator": [
        191,
        199,
        220,
        183,
        153,
        194,
        22,
        206
      ],
      "accounts": [
        {
          "name": "lendingUserAddress"
        },
        {
          "name": "priceValidator",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  97,
                  99,
                  108,
                  101,
                  80,
                  114,
                  105,
                  99,
                  101,
                  86,
                  97,
                  108,
                  105,
                  100,
                  97,
                  116,
                  111,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "tempPriceAccount",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  97,
                  99,
                  108,
                  101,
                  80,
                  114,
                  105,
                  99,
                  101,
                  68,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "lendingUserAddress"
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
          "name": "payload",
          "type": {
            "defined": {
              "name": "priceDataPayload"
            }
          }
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
          "name": "subMarketOwner"
        },
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
                "kind": "account",
                "path": "tokenMint"
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
                "kind": "account",
                "path": "token_reserve.token_id",
                "account": "tokenReserve"
              },
              {
                "kind": "account",
                "path": "subMarketOwner"
              },
              {
                "kind": "arg",
                "path": "subMarketIndex"
              }
            ]
          }
        },
        {
          "name": "lendingUserAccount",
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
                "kind": "account",
                "path": "token_reserve.token_id",
                "account": "tokenReserve"
              },
              {
                "kind": "account",
                "path": "subMarketOwner"
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
                "kind": "account",
                "path": "token_reserve.token_id",
                "account": "tokenReserve"
              },
              {
                "kind": "account",
                "path": "subMarketOwner"
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
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "tokenMint"
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
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "tokenMint"
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
          "name": "tokenMint"
        },
        {
          "name": "tokenProgram"
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
        },
        {
          "name": "lookUpTableAddress",
          "type": {
            "option": "pubkey"
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
          "name": "lendingUserAccount",
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
          "name": "feeCollectorAddress"
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
                "path": "tokenId"
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
          "name": "tokenId",
          "type": "u8"
        },
        {
          "name": "subMarketIndex",
          "type": "u16"
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
          "name": "lookUpTableAddress"
        },
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
          "name": "solvencyTreasurer",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  111,
                  108,
                  118,
                  101,
                  110,
                  99,
                  121,
                  84,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "liquidationTreasurer",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  113,
                  117,
                  105,
                  100,
                  97,
                  116,
                  105,
                  111,
                  110,
                  84,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  101,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "priceValidator",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  97,
                  99,
                  108,
                  101,
                  80,
                  114,
                  105,
                  99,
                  101,
                  86,
                  97,
                  108,
                  105,
                  100,
                  97,
                  116,
                  111,
                  114
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
          "type": "u16"
        }
      ]
    },
    {
      "name": "liquidateAccount",
      "discriminator": [
        39,
        235,
        197,
        252,
        216,
        79,
        212,
        18
      ],
      "accounts": [
        {
          "name": "liquidatiAccountOwner"
        },
        {
          "name": "repaymentSubMarketOwner"
        },
        {
          "name": "liquidationSubMarketOwner"
        },
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
          "name": "repaymentTokenReserve",
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
                "kind": "account",
                "path": "repaymentMint"
              }
            ]
          }
        },
        {
          "name": "liquidationTokenReserve",
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
                "kind": "account",
                "path": "liquidationMint"
              }
            ]
          }
        },
        {
          "name": "liquidatorLendingAccount",
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
                "path": "liquidatorAccountIndex"
              }
            ]
          }
        },
        {
          "name": "liquidatorRepaymentTabAccount",
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
                "kind": "account",
                "path": "repayment_token_reserve.token_id",
                "account": "tokenReserve"
              },
              {
                "kind": "account",
                "path": "repaymentSubMarketOwner"
              },
              {
                "kind": "arg",
                "path": "repaymentSubMarketIndex"
              },
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "arg",
                "path": "liquidatiAccountIndex"
              }
            ]
          }
        },
        {
          "name": "liquidatorLiquidationTabAccount",
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
                "kind": "account",
                "path": "liquidation_token_reserve.token_id",
                "account": "tokenReserve"
              },
              {
                "kind": "account",
                "path": "liquidationSubMarketOwner"
              },
              {
                "kind": "arg",
                "path": "liquidationSubMarketIndex"
              },
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "arg",
                "path": "liquidatorAccountIndex"
              }
            ]
          }
        },
        {
          "name": "liquidatorRepaymentMonthlyStatementAccount",
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
                "kind": "account",
                "path": "repayment_token_reserve.token_id",
                "account": "tokenReserve"
              },
              {
                "kind": "account",
                "path": "repaymentSubMarketOwner"
              },
              {
                "kind": "arg",
                "path": "repaymentSubMarketIndex"
              },
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "arg",
                "path": "liquidatorAccountIndex"
              }
            ]
          }
        },
        {
          "name": "liquidatorLiquidationMonthlyStatementAccount",
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
                "kind": "account",
                "path": "liquidation_token_reserve.token_id",
                "account": "tokenReserve"
              },
              {
                "kind": "account",
                "path": "liquidationSubMarketOwner"
              },
              {
                "kind": "arg",
                "path": "liquidationSubMarketIndex"
              },
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "arg",
                "path": "liquidatorAccountIndex"
              }
            ]
          }
        },
        {
          "name": "liquidatorRepaymentAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "account",
                "path": "repaymentTokenProgram"
              },
              {
                "kind": "account",
                "path": "repaymentMint"
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
          "name": "liquidatorLiquidationAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "account",
                "path": "liquidationTokenProgram"
              },
              {
                "kind": "account",
                "path": "liquidationMint"
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
          "name": "repaymentMint"
        },
        {
          "name": "liquidationMint"
        },
        {
          "name": "repaymentTokenProgram"
        },
        {
          "name": "liquidationTokenProgram"
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
          "name": "repaymentSubMarketIndex",
          "type": "u16"
        },
        {
          "name": "liquidationSubMarketIndex",
          "type": "u16"
        },
        {
          "name": "liquidatiAccountIndex",
          "type": "u8"
        },
        {
          "name": "liquidatorAccountIndex",
          "type": "u8"
        },
        {
          "name": "amountToRepay",
          "type": "u64"
        },
        {
          "name": "repayMax",
          "type": "bool"
        },
        {
          "name": "payingOffInsolventAccount",
          "type": "bool"
        },
        {
          "name": "sendRewardToWallet",
          "type": "bool"
        },
        {
          "name": "accountName",
          "type": {
            "option": "string"
          }
        },
        {
          "name": "lookUpTableAddress",
          "type": {
            "option": "pubkey"
          }
        }
      ]
    },
    {
      "name": "liquidateAccountSameToken",
      "discriminator": [
        87,
        139,
        64,
        138,
        186,
        14,
        19,
        248
      ],
      "accounts": [
        {
          "name": "liquidatiAccountOwner"
        },
        {
          "name": "repaymentSubMarketOwner"
        },
        {
          "name": "liquidationSubMarketOwner"
        },
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
          "name": "priceValidator",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  97,
                  99,
                  108,
                  101,
                  80,
                  114,
                  105,
                  99,
                  101,
                  86,
                  97,
                  108,
                  105,
                  100,
                  97,
                  116,
                  111,
                  114
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
                "kind": "account",
                "path": "tokenMint"
              }
            ]
          }
        },
        {
          "name": "liquidatiLendingAccount",
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
                "path": "liquidatiAccountOwner"
              },
              {
                "kind": "arg",
                "path": "liquidatiAccountIndex"
              }
            ]
          }
        },
        {
          "name": "liquidatorLendingAccount",
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
                "path": "liquidatorAccountIndex"
              }
            ]
          }
        },
        {
          "name": "liquidatorRepaymentTabAccount",
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
                "kind": "account",
                "path": "token_reserve.token_id",
                "account": "tokenReserve"
              },
              {
                "kind": "account",
                "path": "repaymentSubMarketOwner"
              },
              {
                "kind": "arg",
                "path": "repaymentSubMarketIndex"
              },
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "arg",
                "path": "liquidatiAccountIndex"
              }
            ]
          }
        },
        {
          "name": "liquidatorLiquidationTabAccount",
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
                "kind": "account",
                "path": "token_reserve.token_id",
                "account": "tokenReserve"
              },
              {
                "kind": "account",
                "path": "liquidationSubMarketOwner"
              },
              {
                "kind": "arg",
                "path": "liquidationSubMarketIndex"
              },
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "arg",
                "path": "liquidatorAccountIndex"
              }
            ]
          }
        },
        {
          "name": "liquidatorRepaymentMonthlyStatementAccount",
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
                "kind": "account",
                "path": "token_reserve.token_id",
                "account": "tokenReserve"
              },
              {
                "kind": "account",
                "path": "repaymentSubMarketOwner"
              },
              {
                "kind": "arg",
                "path": "repaymentSubMarketIndex"
              },
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "arg",
                "path": "liquidatorAccountIndex"
              }
            ]
          }
        },
        {
          "name": "liquidatorLiquidationMonthlyStatementAccount",
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
                "kind": "account",
                "path": "token_reserve.token_id",
                "account": "tokenReserve"
              },
              {
                "kind": "account",
                "path": "liquidationSubMarketOwner"
              },
              {
                "kind": "arg",
                "path": "liquidationSubMarketIndex"
              },
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "arg",
                "path": "liquidatorAccountIndex"
              }
            ]
          }
        },
        {
          "name": "liquidatorAta",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "tokenMint"
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
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "tokenMint"
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
          "name": "tokenMint"
        },
        {
          "name": "tokenProgram"
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
          "name": "repaymentSubMarketIndex",
          "type": "u16"
        },
        {
          "name": "liquidationSubMarketIndex",
          "type": "u16"
        },
        {
          "name": "liquidatiAccountIndex",
          "type": "u8"
        },
        {
          "name": "liquidatorAccountIndex",
          "type": "u8"
        },
        {
          "name": "amountToRepay",
          "type": "u64"
        },
        {
          "name": "repayMax",
          "type": "bool"
        },
        {
          "name": "payingOffInsolventAccount",
          "type": "bool"
        },
        {
          "name": "sendRewardToWallet",
          "type": "bool"
        },
        {
          "name": "accountName",
          "type": {
            "option": "string"
          }
        },
        {
          "name": "lookUpTableAddress",
          "type": {
            "option": "pubkey"
          }
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
          "name": "newCeoAddress"
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
      "name": "passOnLiquidationTreasurer",
      "discriminator": [
        209,
        70,
        3,
        169,
        246,
        140,
        135,
        251
      ],
      "accounts": [
        {
          "name": "newTreasurerAddress"
        },
        {
          "name": "liquidationTreasurer",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  105,
                  113,
                  117,
                  105,
                  100,
                  97,
                  116,
                  105,
                  111,
                  110,
                  84,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  101,
                  114
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
      "name": "passOnSolvencyTreasurer",
      "discriminator": [
        15,
        244,
        70,
        112,
        78,
        79,
        171,
        226
      ],
      "accounts": [
        {
          "name": "newTreasurerAddress"
        },
        {
          "name": "solvencyTreasurer",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  111,
                  108,
                  118,
                  101,
                  110,
                  99,
                  121,
                  84,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  101,
                  114
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
      "name": "refreshUserHealthChunkAndTokenReserves",
      "discriminator": [
        139,
        75,
        158,
        105,
        3,
        190,
        24,
        182
      ],
      "accounts": [
        {
          "name": "lendingUserOwner"
        },
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
          "name": "priceValidator",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  97,
                  99,
                  108,
                  101,
                  80,
                  114,
                  105,
                  99,
                  101,
                  86,
                  97,
                  108,
                  105,
                  100,
                  97,
                  116,
                  111,
                  114
                ]
              }
            ]
          }
        },
        {
          "name": "lendingUserAccount",
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
                "path": "lendingUserOwner"
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
          "name": "refreshTokenReserveCount",
          "type": "u8"
        },
        {
          "name": "setCount",
          "type": "u8"
        },
        {
          "name": "closePriceAccount",
          "type": "bool"
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
          "name": "subMarketOwner"
        },
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
          "name": "priceValidator",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  97,
                  99,
                  108,
                  101,
                  80,
                  114,
                  105,
                  99,
                  101,
                  86,
                  97,
                  108,
                  105,
                  100,
                  97,
                  116,
                  111,
                  114
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
                "kind": "account",
                "path": "tokenMint"
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
                "kind": "account",
                "path": "token_reserve.token_id",
                "account": "tokenReserve"
              },
              {
                "kind": "account",
                "path": "subMarketOwner"
              },
              {
                "kind": "arg",
                "path": "subMarketIndex"
              }
            ]
          }
        },
        {
          "name": "lendingUserAccount",
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
                "kind": "account",
                "path": "token_reserve.token_id",
                "account": "tokenReserve"
              },
              {
                "kind": "account",
                "path": "subMarketOwner"
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
                "kind": "account",
                "path": "token_reserve.token_id",
                "account": "tokenReserve"
              },
              {
                "kind": "account",
                "path": "subMarketOwner"
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
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "tokenMint"
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
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "tokenMint"
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
          "name": "tokenMint"
        },
        {
          "name": "tokenProgram"
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
      "name": "setOraclePriceValidator",
      "discriminator": [
        242,
        104,
        157,
        103,
        202,
        132,
        205,
        59
      ],
      "accounts": [
        {
          "name": "newPriceValidatorAddress"
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
          "name": "priceValidator",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  97,
                  99,
                  108,
                  101,
                  80,
                  114,
                  105,
                  99,
                  101,
                  86,
                  97,
                  108,
                  105,
                  100,
                  97,
                  116,
                  111,
                  114
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
          "type": "u16"
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
          "name": "tokenMintAddress"
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
                "kind": "account",
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
          "name": "fixedBorrowApy",
          "type": "u16"
        },
        {
          "name": "useFixedBorrowApy",
          "type": "bool"
        },
        {
          "name": "globalLimit",
          "type": "u128"
        },
        {
          "name": "solvencyInsuranceFeeRate",
          "type": "u16"
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
          "name": "subMarketOwner"
        },
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
          "name": "priceValidator",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  111,
                  114,
                  97,
                  99,
                  108,
                  101,
                  80,
                  114,
                  105,
                  99,
                  101,
                  86,
                  97,
                  108,
                  105,
                  100,
                  97,
                  116,
                  111,
                  114
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
                "kind": "account",
                "path": "tokenMint"
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
                "kind": "account",
                "path": "token_reserve.token_id",
                "account": "tokenReserve"
              },
              {
                "kind": "account",
                "path": "subMarketOwner"
              },
              {
                "kind": "arg",
                "path": "subMarketIndex"
              }
            ]
          }
        },
        {
          "name": "lendingUserAccount",
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
                "kind": "account",
                "path": "token_reserve.token_id",
                "account": "tokenReserve"
              },
              {
                "kind": "account",
                "path": "subMarketOwner"
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
                "kind": "account",
                "path": "token_reserve.token_id",
                "account": "tokenReserve"
              },
              {
                "kind": "account",
                "path": "subMarketOwner"
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
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "tokenMint"
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
                "kind": "account",
                "path": "tokenProgram"
              },
              {
                "kind": "account",
                "path": "tokenMint"
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
          "name": "tokenMint"
        },
        {
          "name": "tokenProgram"
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
          "name": "withdrawMax",
          "type": "bool"
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
      "name": "liquidationTreasurer",
      "discriminator": [
        249,
        79,
        140,
        59,
        126,
        135,
        20,
        160
      ]
    },
    {
      "name": "oraclePriceValidator",
      "discriminator": [
        133,
        81,
        225,
        243,
        107,
        178,
        162,
        121
      ]
    },
    {
      "name": "solvencyTreasurer",
      "discriminator": [
        171,
        84,
        80,
        96,
        255,
        2,
        147,
        36
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
      "name": "subMarketOwnerLookUpTable",
      "discriminator": [
        29,
        245,
        213,
        117,
        32,
        15,
        98,
        162
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
      "name": "tempOraclePriceAccount",
      "discriminator": [
        247,
        88,
        158,
        105,
        63,
        26,
        157,
        193
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
      "name": "notCeo",
      "msg": "Only the CEO can call this function"
    },
    {
      "code": 6001,
      "name": "notSolvencyTreasurer",
      "msg": "Only the Solvency Treasurer can call this function"
    },
    {
      "code": 6002,
      "name": "notLiquidationTreasurer",
      "msg": "Only the Liquidation Treasurer can call this function"
    },
    {
      "code": 6003,
      "name": "notFeeCollector",
      "msg": "Only the Fee Collector can claim the fees"
    },
    {
      "code": 6004,
      "name": "notPriceOracle",
      "msg": "Only the Price Oracle can call this function"
    },
    {
      "code": 6005,
      "name": "priceOracleKeyMisMatched",
      "msg": "Price Oracle Public Key did not match"
    },
    {
      "code": 6006,
      "name": "missingRemainingAccount",
      "msg": "Expected remaining account missing"
    },
    {
      "code": 6007,
      "name": "missingSubMarketLookUpTable",
      "msg": "You must include a Look Up Table Address when a user creates their first Sub Market"
    },
    {
      "code": 6008,
      "name": "invalidSubMarketFeeRate",
      "msg": "The Sub Market fee on interest earned rate can't be greater than 100%"
    },
    {
      "code": 6009,
      "name": "invalidSolvencyInsuranceFeeRate",
      "msg": "The solvency insurance fee on interest earned rate can't be greater than 100%"
    },
    {
      "code": 6010,
      "name": "missingLendingUserLookUpTable",
      "msg": "You must include a Look Up Table Address when a user initializes their Lending User Account"
    },
    {
      "code": 6011,
      "name": "incorrectOrderOfTabAccounts",
      "msg": "You must provide the sub user's tab accounts ordered by user_tab_account_index"
    },
    {
      "code": 6012,
      "name": "oracleDataStale",
      "msg": "Oracle price was stale"
    },
    {
      "code": 6013,
      "name": "oraclePriceNotFound",
      "msg": "Oracle price not found"
    },
    {
      "code": 6014,
      "name": "unexpectedLendingStatsAccount",
      "msg": "Unexpected Lending Stats PDA detected"
    },
    {
      "code": 6015,
      "name": "unexpectedTokenReserveAccount",
      "msg": "Unexpected Token Reserve Account PDA detected"
    },
    {
      "code": 6016,
      "name": "unexpectedSubMarketAccount",
      "msg": "Unexpected SubMarket Account PDA detected"
    },
    {
      "code": 6017,
      "name": "unexpectedLendingUserAccount",
      "msg": "Unexpected Lending User Account PDA detected"
    },
    {
      "code": 6018,
      "name": "unexpectedTabAccount",
      "msg": "Unexpected Tab Account PDA detected"
    },
    {
      "code": 6019,
      "name": "unexpectedMonthlyStatementAccount",
      "msg": "Unexpected Monthly Statement Account PDA detected"
    },
    {
      "code": 6020,
      "name": "unexpectedOraclePriceValidatorAccount",
      "msg": "Unexpected Oracle Price Validator PDA detected"
    },
    {
      "code": 6021,
      "name": "unexpectedOraclePriceDataAccount",
      "msg": "Unexpected Oracle Price Data PDA detected"
    },
    {
      "code": 6022,
      "name": "invalidTokenAccount",
      "msg": "Invalid Token Account"
    },
    {
      "code": 6023,
      "name": "invalidTokenAccountMint",
      "msg": "Invalid Token Account Mint"
    },
    {
      "code": 6024,
      "name": "invalidTokenAccountOwner",
      "msg": "Invalid Token Account Owner"
    },
    {
      "code": 6025,
      "name": "lendingUserAccountNameTooLong",
      "msg": "Lending User Account name can't be longer than 25 characters"
    },
    {
      "code": 6026,
      "name": "globalLimitExceeded",
      "msg": "You can't deposit more than the global limit"
    },
    {
      "code": 6027,
      "name": "insufficientFunds",
      "msg": "You can't withdraw more funds than you've deposited"
    },
    {
      "code": 6028,
      "name": "insufficientLiquidity",
      "msg": "Not enough liquidity in the Token Reserve for this withdraw or borrow"
    },
    {
      "code": 6029,
      "name": "tooManyFunds",
      "msg": "You can't pay back more funds than you've borrowed"
    },
    {
      "code": 6030,
      "name": "missingTokenReserveAccountForRefresh",
      "msg": "Expected Token Reserve missing for user refresh"
    },
    {
      "code": 6031,
      "name": "staleTokenReserveOrLendingUser",
      "msg": "Token Reserve or lending user health data was stale"
    },
    {
      "code": 6032,
      "name": "griefingRepayment",
      "msg": "You must repay atleast 10% of the borrow position if the account is in an unhealthy state. This prevents 'griefing'"
    },
    {
      "code": 6033,
      "name": "liquidationExposure",
      "msg": "You can't withdraw or borrow an amount that would cause your borrow liabilities to exceed 70% of deposited collateral"
    },
    {
      "code": 6034,
      "name": "notLiquidatable",
      "msg": "You can't liquidate an account whose borrow liabilities aren't 80% or more of their deposited collateral"
    },
    {
      "code": 6035,
      "name": "overLiquidation",
      "msg": "You can't repay more than 50% of a liquidati's debt position"
    },
    {
      "code": 6036,
      "name": "notInsolvent",
      "msg": "You can't zero out an account whose borrow liabilities aren't 100% or more of their deposited collateral"
    },
    {
      "code": 6037,
      "name": "duplicateSubMarket",
      "msg": "Duplicate SubMarket Detected"
    },
    {
      "code": 6038,
      "name": "tooManyTabAccounts",
      "msg": "Each Lending User Account can have no more than 5 Tab Accounts. Please make new account"
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
            "type": "u16"
          },
          {
            "name": "lookUpTableAddress",
            "type": "pubkey"
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
            "name": "bump",
            "type": "u8"
          },
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
            "name": "bump",
            "type": "u8"
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
            "name": "accountName",
            "type": "string"
          },
          {
            "name": "lendingUserAccountAdded",
            "type": "bool"
          },
          {
            "name": "tabAccountCount",
            "type": "u8"
          },
          {
            "name": "totalDepositedUsdValue",
            "type": "u128"
          },
          {
            "name": "totalBorrowedUsdValue",
            "type": "u128"
          },
          {
            "name": "refreshClockSlot",
            "type": "u64"
          },
          {
            "name": "lastHealthUpdateClockSlot",
            "type": "u64"
          },
          {
            "name": "tempDepositUsdValue",
            "type": "u128"
          },
          {
            "name": "tempBorrowUsdValue",
            "type": "u128"
          },
          {
            "name": "nextTabIndexToRefresh",
            "type": "u8"
          },
          {
            "name": "lookUpTableAddress",
            "type": "pubkey"
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
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "tokenId",
            "type": "u8"
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
            "type": "u16"
          },
          {
            "name": "monthlyStatementAccountAdded",
            "type": "bool"
          },
          {
            "name": "snapShotBalanceAmount",
            "type": "u64"
          },
          {
            "name": "snapShotDebtAmount",
            "type": "u64"
          },
          {
            "name": "monthlyDepositedAmount",
            "type": "u64"
          },
          {
            "name": "monthlyInterestEarnedAmount",
            "type": "u64"
          },
          {
            "name": "monthlySubMarketFeesGeneratedAmount",
            "type": "u64"
          },
          {
            "name": "monthlySubMarketFeesCollectedAmount",
            "type": "u64"
          },
          {
            "name": "monthlySolvencyInsuranceFeesGeneratedAmount",
            "type": "u64"
          },
          {
            "name": "monthlySolvencyInsuranceFeesCollectedAmount",
            "type": "u64"
          },
          {
            "name": "monthlyLiquidationFeesGeneratedAmount",
            "type": "u64"
          },
          {
            "name": "monthlyLiquidationFeesCollectedAmount",
            "type": "u64"
          },
          {
            "name": "monthlyWithdrawalAmount",
            "type": "u64"
          },
          {
            "name": "monthlyBorrowedAmount",
            "type": "u64"
          },
          {
            "name": "monthlyInterestAccruedAmount",
            "type": "u64"
          },
          {
            "name": "monthlyRepaidDebtAmount",
            "type": "u64"
          },
          {
            "name": "monthlyLiquidatedAmount",
            "type": "u64"
          },
          {
            "name": "monthlyLiquidatorAmount",
            "type": "u64"
          },
          {
            "name": "lastLendingActivityAmount",
            "type": "u64"
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
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "tokenId",
            "type": "u8"
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
            "name": "userTabAccountIndex",
            "type": "u8"
          },
          {
            "name": "userTabAccountAdded",
            "type": "bool"
          },
          {
            "name": "supplyInterestChangeIndex",
            "type": "u128"
          },
          {
            "name": "borrowInterestChangeIndex",
            "type": "u128"
          },
          {
            "name": "depositedAmount",
            "type": "u64"
          },
          {
            "name": "interestEarnedAmount",
            "type": "u64"
          },
          {
            "name": "subMarketFeesGeneratedAmount",
            "type": "u64"
          },
          {
            "name": "subMarketFeesCollectedAmount",
            "type": "u64"
          },
          {
            "name": "solvencyInsuranceFeesGeneratedAmount",
            "type": "u64"
          },
          {
            "name": "solvencyInsuranceFeesCollectedAmount",
            "type": "u64"
          },
          {
            "name": "liquidationFeesGeneratedAmount",
            "type": "u64"
          },
          {
            "name": "liquidationFeesCollectedAmount",
            "type": "u64"
          },
          {
            "name": "borrowedAmount",
            "type": "u64"
          },
          {
            "name": "interestAccruedAmount",
            "type": "u64"
          },
          {
            "name": "repaidDebtAmount",
            "type": "u64"
          },
          {
            "name": "liquidatedAmount",
            "type": "u64"
          },
          {
            "name": "liquidatorAmount",
            "type": "u64"
          },
          {
            "name": "interestChangeLastUpdatedClockSlot",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "liquidationTreasurer",
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
      "name": "oraclePriceValidator",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "address",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "priceDataPayload",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "data",
            "type": {
              "vec": {
                "defined": {
                  "name": "verifiedPriceData"
                }
              }
            }
          },
          {
            "name": "slot",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "solvencyTreasurer",
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
      "name": "subMarket",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "id",
            "type": "u32"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "tokenId",
            "type": "u8"
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
            "name": "supplyInterestChangeIndex",
            "type": "u128"
          },
          {
            "name": "borrowInterestChangeIndex",
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
            "name": "subMarketFeesGeneratedAmount",
            "type": "u128"
          },
          {
            "name": "uncollectedSubMarketFeesAmount",
            "type": "u128"
          },
          {
            "name": "solvencyInsuranceFeesGeneratedAmount",
            "type": "u128"
          },
          {
            "name": "liquidationFeesGeneratedAmount",
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
            "type": "u64"
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
      "name": "subMarketOwnerLookUpTable",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "lookUpTableAddress",
            "type": "pubkey"
          },
          {
            "name": "lookUpTableAdded",
            "type": "bool"
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
      "name": "tempOraclePriceAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "data",
            "type": {
              "vec": {
                "defined": {
                  "name": "verifiedPriceData"
                }
              }
            }
          },
          {
            "name": "slot",
            "type": "u64"
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
            "name": "bump",
            "type": "u8"
          },
          {
            "name": "tokenId",
            "type": "u8"
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
            "name": "supplyApy",
            "type": "u16"
          },
          {
            "name": "borrowApy",
            "type": "u16"
          },
          {
            "name": "fixedBorrowApy",
            "type": "u16"
          },
          {
            "name": "useFixedBorrowApy",
            "type": "bool"
          },
          {
            "name": "utilizationRate",
            "type": "u16"
          },
          {
            "name": "globalLimit",
            "type": "u128"
          },
          {
            "name": "supplyInterestChangeIndex",
            "type": "u128"
          },
          {
            "name": "borrowInterestChangeIndex",
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
            "name": "subMarketFeesGeneratedAmount",
            "type": "u128"
          },
          {
            "name": "solvencyInsuranceFeeRate",
            "type": "u16"
          },
          {
            "name": "solvencyInsuranceFeesGeneratedAmount",
            "type": "u128"
          },
          {
            "name": "uncollectedSolvencyInsuranceFeesAmount",
            "type": "u128"
          },
          {
            "name": "liquidationFeesGeneratedAmount",
            "type": "u128"
          },
          {
            "name": "uncollectedLiquidationFeesAmount",
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
            "type": "u64"
          },
          {
            "name": "lastLendingActivityType",
            "type": "u8"
          },
          {
            "name": "lastLendingActivityTimeStamp",
            "type": "u64"
          },
          {
            "name": "lastHealthUpdateClockSlot",
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
            "type": "u8"
          },
          {
            "name": "tokenReservesUpdatedCount",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "verifiedPriceData",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "tokenId",
            "type": "u8"
          },
          {
            "name": "normalizedPrice18Decimals",
            "type": "u128"
          }
        ]
      }
    }
  ]
}