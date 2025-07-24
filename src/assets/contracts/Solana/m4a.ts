/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/m_4_a_protocol.json`.
 */
export type M4AProtocol = {
  "address": "GhPZGuJbS8ckuXgdkDNweaDbvwMGquFbwGrfokN97a2v",
  "metadata": {
    "name": "m4AProtocol",
    "version": "1.0.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "appealDeniedClaimWithAllRecords",
      "discriminator": [
        178,
        56,
        168,
        15,
        232,
        152,
        169,
        76
      ],
      "accounts": [
        {
          "name": "processorStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
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
          "name": "submitter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  98,
                  109,
                  105,
                  116,
                  116,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.submitter_address",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "patient",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  116,
                  105,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.submitter_address",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.patient_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.country_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.state_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "patientRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  116,
                  105,
                  101,
                  110,
                  116,
                  82,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.submitter_address",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.patient_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.patient_record_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "hospital",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  111,
                  115,
                  112,
                  105,
                  116,
                  97,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.country_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.state_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.hospital_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "hospitalRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  111,
                  115,
                  112,
                  105,
                  116,
                  97,
                  108,
                  82,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.country_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.state_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.hospital_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.hospital_record_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "insuranceCompany",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  110,
                  115,
                  117,
                  114,
                  97,
                  110,
                  99,
                  101,
                  67,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.insurance_company_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "insuranceCompanyRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  110,
                  115,
                  117,
                  114,
                  97,
                  110,
                  99,
                  101,
                  67,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121,
                  82,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.insurance_company_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.insurance_company_record_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "processedClaim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  101,
                  100,
                  67,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "arg",
                "path": "processorAddress"
              },
              {
                "kind": "arg",
                "path": "processorCountIndex"
              }
            ]
          }
        },
        {
          "name": "userUsdcAta",
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
                "kind": "const",
                "value": [
                  59,
                  68,
                  44,
                  179,
                  145,
                  33,
                  87,
                  241,
                  58,
                  147,
                  61,
                  1,
                  52,
                  40,
                  45,
                  3,
                  43,
                  95,
                  254,
                  205,
                  1,
                  162,
                  219,
                  241,
                  183,
                  121,
                  6,
                  8,
                  223,
                  0,
                  46,
                  167
                ]
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
          "name": "feeRecipientUsdcAta",
          "writable": true,
          "address": "7onyD3ypcQo5rQLZFGjhbGRhTdirwBzBhQn9whKg1nXx"
        },
        {
          "name": "usdcMint",
          "address": "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
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
          "name": "processorAddress",
          "type": "pubkey"
        },
        {
          "name": "processorCountIndex",
          "type": "u64"
        },
        {
          "name": "appealReason",
          "type": "string"
        }
      ]
    },
    {
      "name": "appealDeniedClaimWithOnlyPatientRecord",
      "discriminator": [
        47,
        129,
        122,
        194,
        250,
        40,
        119,
        29
      ],
      "accounts": [
        {
          "name": "processorStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
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
          "name": "submitter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  98,
                  109,
                  105,
                  116,
                  116,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.submitter_address",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "patient",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  116,
                  105,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.submitter_address",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.patient_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.country_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.state_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "patientRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  116,
                  105,
                  101,
                  110,
                  116,
                  82,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.submitter_address",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.patient_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.patient_record_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "processedClaim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  101,
                  100,
                  67,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "arg",
                "path": "processorAddress"
              },
              {
                "kind": "arg",
                "path": "processorCountIndex"
              }
            ]
          }
        },
        {
          "name": "userUsdcAta",
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
                "kind": "const",
                "value": [
                  59,
                  68,
                  44,
                  179,
                  145,
                  33,
                  87,
                  241,
                  58,
                  147,
                  61,
                  1,
                  52,
                  40,
                  45,
                  3,
                  43,
                  95,
                  254,
                  205,
                  1,
                  162,
                  219,
                  241,
                  183,
                  121,
                  6,
                  8,
                  223,
                  0,
                  46,
                  167
                ]
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
          "name": "feeRecipientUsdcAta",
          "writable": true,
          "address": "7onyD3ypcQo5rQLZFGjhbGRhTdirwBzBhQn9whKg1nXx"
        },
        {
          "name": "usdcMint",
          "address": "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
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
          "name": "processorAddress",
          "type": "pubkey"
        },
        {
          "name": "processorCountIndex",
          "type": "u64"
        },
        {
          "name": "appealReason",
          "type": "string"
        }
      ]
    },
    {
      "name": "approveClaim",
      "discriminator": [
        74,
        228,
        211,
        63,
        140,
        255,
        69,
        210
      ],
      "accounts": [
        {
          "name": "processorStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
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
          "name": "claimQueue",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109,
                  81,
                  117,
                  101,
                  117,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "submitter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  98,
                  109,
                  105,
                  116,
                  116,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "claim.submitter_address",
                "account": "claim"
              }
            ]
          }
        },
        {
          "name": "patient",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  116,
                  105,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "claim.submitter_address",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.patient_index",
                "account": "claim"
              }
            ]
          }
        },
        {
          "name": "processor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
                  114
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
          "name": "state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "claim.country_index",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.state_index",
                "account": "claim"
              }
            ]
          }
        },
        {
          "name": "patientRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  116,
                  105,
                  101,
                  110,
                  116,
                  82,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "claim.submitter_address",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.patient_index",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.patient_record_index",
                "account": "claim"
              }
            ]
          }
        },
        {
          "name": "hospital",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  111,
                  115,
                  112,
                  105,
                  116,
                  97,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "claim.country_index",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.state_index",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.hospital_index",
                "account": "claim"
              }
            ]
          }
        },
        {
          "name": "hospitalRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  111,
                  115,
                  112,
                  105,
                  116,
                  97,
                  108,
                  82,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "claim.country_index",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.state_index",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.hospital_index",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.hospital_record_index",
                "account": "claim"
              }
            ]
          }
        },
        {
          "name": "insuranceCompany",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  110,
                  115,
                  117,
                  114,
                  97,
                  110,
                  99,
                  101,
                  67,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "claim.insurance_company_index",
                "account": "claim"
              }
            ]
          }
        },
        {
          "name": "insuranceCompanyRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  110,
                  115,
                  117,
                  114,
                  97,
                  110,
                  99,
                  101,
                  67,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121,
                  82,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "claim.insurance_company_index",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.insurance_company_record_index",
                "account": "claim"
              }
            ]
          }
        },
        {
          "name": "processedClaim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  101,
                  100,
                  67,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "account",
                "path": "processor.processed_claim_count",
                "account": "processorAccount"
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
        },
        {
          "name": "claim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "arg",
                "path": "submitterAddress"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "submitterAddress",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "approveClaimWithEdits",
      "discriminator": [
        71,
        55,
        128,
        152,
        170,
        150,
        158,
        176
      ],
      "accounts": [
        {
          "name": "processorStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
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
          "name": "claimQueue",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109,
                  81,
                  117,
                  101,
                  117,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "submitter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  98,
                  109,
                  105,
                  116,
                  116,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "claim.submitter_address",
                "account": "claim"
              }
            ]
          }
        },
        {
          "name": "patient",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  116,
                  105,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "claim.submitter_address",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.patient_index",
                "account": "claim"
              }
            ]
          }
        },
        {
          "name": "processor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
                  114
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
          "name": "state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "claim.country_index",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.state_index",
                "account": "claim"
              }
            ]
          }
        },
        {
          "name": "claim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "arg",
                "path": "submitterAddress"
              }
            ]
          }
        },
        {
          "name": "patientRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  116,
                  105,
                  101,
                  110,
                  116,
                  82,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "claim.submitter_address",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.patient_index",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.patient_record_index",
                "account": "claim"
              }
            ]
          }
        },
        {
          "name": "hospital",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  111,
                  115,
                  112,
                  105,
                  116,
                  97,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "claim.country_index",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.state_index",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.hospital_index",
                "account": "claim"
              }
            ]
          }
        },
        {
          "name": "hospitalRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  111,
                  115,
                  112,
                  105,
                  116,
                  97,
                  108,
                  82,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "claim.country_index",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.state_index",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.hospital_index",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.hospital_record_index",
                "account": "claim"
              }
            ]
          }
        },
        {
          "name": "insuranceCompany",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  110,
                  115,
                  117,
                  114,
                  97,
                  110,
                  99,
                  101,
                  67,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "claim.insurance_company_index",
                "account": "claim"
              }
            ]
          }
        },
        {
          "name": "insuranceCompanyRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  110,
                  115,
                  117,
                  114,
                  97,
                  110,
                  99,
                  101,
                  67,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121,
                  82,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "claim.insurance_company_index",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.insurance_company_record_index",
                "account": "claim"
              }
            ]
          }
        },
        {
          "name": "processedClaim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  101,
                  100,
                  67,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "account",
                "path": "processor.processed_claim_count",
                "account": "processorAccount"
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
          "name": "submitterAddress",
          "type": "pubkey"
        },
        {
          "name": "hospitalType",
          "type": "u8"
        },
        {
          "name": "hospitalLongitude",
          "type": "f64"
        },
        {
          "name": "hospitalLatitude",
          "type": "f64"
        },
        {
          "name": "hospitalName",
          "type": "string"
        },
        {
          "name": "hospitalAddress",
          "type": "string"
        },
        {
          "name": "hospitalCity",
          "type": "string"
        },
        {
          "name": "hospitalZipCode",
          "type": "u32"
        },
        {
          "name": "hospitalPhoneNumber",
          "type": "u128"
        },
        {
          "name": "hospitalBillInvoiceNumber",
          "type": "string"
        },
        {
          "name": "claimNote",
          "type": "string"
        },
        {
          "name": "claimAmount",
          "type": "u64"
        },
        {
          "name": "ailment",
          "type": "string"
        },
        {
          "name": "insuranceCompanyName",
          "type": "string"
        }
      ]
    },
    {
      "name": "assignClaimToProcessor",
      "discriminator": [
        224,
        14,
        107,
        216,
        19,
        179,
        163,
        164
      ],
      "accounts": [
        {
          "name": "processorStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
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
          "name": "claim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "arg",
                "path": "submitterAddress"
              }
            ]
          }
        },
        {
          "name": "processor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
                  114
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
          "name": "submitterAddress",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "createHospital",
      "discriminator": [
        195,
        16,
        140,
        89,
        250,
        244,
        18,
        77
      ],
      "accounts": [
        {
          "name": "hospitalStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  111,
                  115,
                  112,
                  105,
                  116,
                  97,
                  108,
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
          "name": "processor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
                  114
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
          "name": "claim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "arg",
                "path": "submitterAddress"
              }
            ]
          }
        },
        {
          "name": "state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "countryIndex"
              },
              {
                "kind": "arg",
                "path": "stateIndex"
              }
            ]
          }
        },
        {
          "name": "hospital",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  111,
                  115,
                  112,
                  105,
                  116,
                  97,
                  108
                ]
              },
              {
                "kind": "arg",
                "path": "countryIndex"
              },
              {
                "kind": "arg",
                "path": "stateIndex"
              },
              {
                "kind": "account",
                "path": "state.hospital_count",
                "account": "stateAccount"
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
          "name": "submitterAddress",
          "type": "pubkey"
        },
        {
          "name": "countryIndex",
          "type": "u16"
        },
        {
          "name": "stateIndex",
          "type": "u32"
        },
        {
          "name": "hospitalType",
          "type": "u8"
        },
        {
          "name": "hospitalLongitude",
          "type": "f64"
        },
        {
          "name": "hospitalLatitude",
          "type": "f64"
        },
        {
          "name": "hospitalName",
          "type": "string"
        },
        {
          "name": "hospitalAddress",
          "type": "string"
        },
        {
          "name": "hospitalCity",
          "type": "string"
        },
        {
          "name": "hospitalZipCode",
          "type": "u32"
        },
        {
          "name": "hospitalPhoneNumber",
          "type": "u128"
        },
        {
          "name": "note",
          "type": "string"
        }
      ]
    },
    {
      "name": "createHospitalAndInsuranceCompanyRecords",
      "discriminator": [
        64,
        7,
        201,
        196,
        8,
        169,
        174,
        238
      ],
      "accounts": [
        {
          "name": "processorStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
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
          "name": "processor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
                  114
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
          "name": "claim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "arg",
                "path": "submitterAddress"
              }
            ]
          }
        },
        {
          "name": "patientRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  116,
                  105,
                  101,
                  110,
                  116,
                  82,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "claim.submitter_address",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.patient_index",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.patient_record_index",
                "account": "claim"
              }
            ]
          }
        },
        {
          "name": "hospital",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  111,
                  115,
                  112,
                  105,
                  116,
                  97,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "claim.country_index",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.state_index",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.hospital_index",
                "account": "claim"
              }
            ]
          }
        },
        {
          "name": "hospitalRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  111,
                  115,
                  112,
                  105,
                  116,
                  97,
                  108,
                  82,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "claim.country_index",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.state_index",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.hospital_index",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "hospital.record_count",
                "account": "hospital"
              }
            ]
          }
        },
        {
          "name": "insuranceCompany",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  110,
                  115,
                  117,
                  114,
                  97,
                  110,
                  99,
                  101,
                  67,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "claim.insurance_company_index",
                "account": "claim"
              }
            ]
          }
        },
        {
          "name": "insuranceCompanyRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  110,
                  115,
                  117,
                  114,
                  97,
                  110,
                  99,
                  101,
                  67,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121,
                  82,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "claim.insurance_company_index",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "insurance_company.record_count",
                "account": "insuranceCompany"
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
          "name": "submitterAddress",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "createInsuranceCompany",
      "discriminator": [
        198,
        248,
        174,
        91,
        220,
        201,
        128,
        240
      ],
      "accounts": [
        {
          "name": "insuranceCompanyStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  110,
                  115,
                  117,
                  114,
                  97,
                  110,
                  99,
                  101,
                  67,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121,
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
          "name": "processor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
                  114
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
          "name": "claim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "arg",
                "path": "submitterAddress"
              }
            ]
          }
        },
        {
          "name": "insuranceCompany",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  110,
                  115,
                  117,
                  114,
                  97,
                  110,
                  99,
                  101,
                  67,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121
                ]
              },
              {
                "kind": "arg",
                "path": "insuranceCompanyIndex"
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
          "name": "submitterAddress",
          "type": "pubkey"
        },
        {
          "name": "insuranceCompanyIndex",
          "type": "u16"
        },
        {
          "name": "insuranceCompanyName",
          "type": "string"
        },
        {
          "name": "note",
          "type": "string"
        }
      ]
    },
    {
      "name": "createPatientAccount",
      "discriminator": [
        92,
        154,
        117,
        100,
        103,
        190,
        19,
        146
      ],
      "accounts": [
        {
          "name": "m4aProtocol",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  52,
                  97,
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
          "name": "submitter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  98,
                  109,
                  105,
                  116,
                  116,
                  101,
                  114
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
          "name": "patient",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  116,
                  105,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "account",
                "path": "submitter.patient_count",
                "account": "submitterAccount"
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
          "name": "patientFirstName",
          "type": "string"
        },
        {
          "name": "patientLastName",
          "type": "string"
        }
      ]
    },
    {
      "name": "createPatientRecord",
      "discriminator": [
        88,
        186,
        28,
        28,
        137,
        255,
        182,
        80
      ],
      "accounts": [
        {
          "name": "processorStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
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
          "name": "processor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
                  114
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
          "name": "claim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "arg",
                "path": "submitterAddress"
              }
            ]
          }
        },
        {
          "name": "patient",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  116,
                  105,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "claim.submitter_address",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.patient_index",
                "account": "claim"
              }
            ]
          }
        },
        {
          "name": "patientRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  116,
                  105,
                  101,
                  110,
                  116,
                  82,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "claim.submitter_address",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.patient_index",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "patient.record_count",
                "account": "patientAccount"
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
          "name": "submitterAddress",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "createPatientRecordAndDenyClaim",
      "discriminator": [
        144,
        239,
        16,
        18,
        21,
        155,
        71,
        57
      ],
      "accounts": [
        {
          "name": "processorStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
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
          "name": "claimQueue",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109,
                  81,
                  117,
                  101,
                  117,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "submitter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  98,
                  109,
                  105,
                  116,
                  116,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "claim.submitter_address",
                "account": "claim"
              }
            ]
          }
        },
        {
          "name": "patient",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  116,
                  105,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "claim.submitter_address",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.patient_index",
                "account": "claim"
              }
            ]
          }
        },
        {
          "name": "processor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
                  114
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
          "name": "state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "claim.country_index",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.state_index",
                "account": "claim"
              }
            ]
          }
        },
        {
          "name": "patientRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  116,
                  105,
                  101,
                  110,
                  116,
                  82,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "claim.submitter_address",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.patient_index",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "patient.record_count",
                "account": "patientAccount"
              }
            ]
          }
        },
        {
          "name": "processedClaim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  101,
                  100,
                  67,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "account",
                "path": "processor.processed_claim_count",
                "account": "processorAccount"
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
        },
        {
          "name": "claim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "arg",
                "path": "submitterAddress"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "submitterAddress",
          "type": "pubkey"
        },
        {
          "name": "denialReason",
          "type": "string"
        }
      ]
    },
    {
      "name": "createProcessorAccount",
      "discriminator": [
        62,
        214,
        27,
        23,
        163,
        141,
        87,
        253
      ],
      "accounts": [
        {
          "name": "ceo",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  52,
                  97,
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
          "name": "processorStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
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
          "name": "processor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
                  114
                ]
              },
              {
                "kind": "arg",
                "path": "processorAddress"
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
          "name": "processorAddress",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "createStateAccount",
      "discriminator": [
        201,
        86,
        60,
        150,
        13,
        71,
        207,
        106
      ],
      "accounts": [
        {
          "name": "m4aProtocol",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  52,
                  97,
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
          "name": "processor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
                  114
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
          "name": "state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "countryIndex"
              },
              {
                "kind": "arg",
                "path": "stateIndex"
              }
            ]
          }
        },
        {
          "name": "claim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "arg",
                "path": "submitterAddress"
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
          "name": "submitterAddress",
          "type": "pubkey"
        },
        {
          "name": "countryIndex",
          "type": "u16"
        },
        {
          "name": "stateIndex",
          "type": "u32"
        }
      ]
    },
    {
      "name": "createSubmitterAccount",
      "discriminator": [
        237,
        8,
        35,
        38,
        50,
        88,
        144,
        238
      ],
      "accounts": [
        {
          "name": "m4aProtocol",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  52,
                  97,
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
          "name": "submitter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  98,
                  109,
                  105,
                  116,
                  116,
                  101,
                  114
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
      "name": "denyAppealedClaimWithAllRecords",
      "discriminator": [
        38,
        137,
        26,
        195,
        65,
        125,
        62,
        57
      ],
      "accounts": [
        {
          "name": "ceo",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  52,
                  97,
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
          "name": "processorStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
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
          "name": "submitter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  98,
                  109,
                  105,
                  116,
                  116,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.submitter_address",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "patient",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  116,
                  105,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.submitter_address",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.patient_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "processor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
                  114
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
          "name": "state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.country_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.state_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "patientRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  116,
                  105,
                  101,
                  110,
                  116,
                  82,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.submitter_address",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.patient_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.patient_record_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "hospital",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  111,
                  115,
                  112,
                  105,
                  116,
                  97,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.country_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.state_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.hospital_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "hospitalRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  111,
                  115,
                  112,
                  105,
                  116,
                  97,
                  108,
                  82,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.country_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.state_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.hospital_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.hospital_record_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "insuranceCompany",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  110,
                  115,
                  117,
                  114,
                  97,
                  110,
                  99,
                  101,
                  67,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.insurance_company_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "insuranceCompanyRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  110,
                  115,
                  117,
                  114,
                  97,
                  110,
                  99,
                  101,
                  67,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121,
                  82,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.insurance_company_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.insurance_company_record_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "processedClaim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  101,
                  100,
                  67,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "arg",
                "path": "processorAddress"
              },
              {
                "kind": "arg",
                "path": "processorCountIndex"
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
          "name": "processorAddress",
          "type": "pubkey"
        },
        {
          "name": "processorCountIndex",
          "type": "u64"
        },
        {
          "name": "denialReason",
          "type": "string"
        }
      ]
    },
    {
      "name": "denyAppealedClaimWithOnlyPatientRecord",
      "discriminator": [
        106,
        210,
        24,
        122,
        190,
        129,
        133,
        0
      ],
      "accounts": [
        {
          "name": "ceo",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  52,
                  97,
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
          "name": "processorStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
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
          "name": "submitter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  98,
                  109,
                  105,
                  116,
                  116,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.submitter_address",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "patient",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  116,
                  105,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.submitter_address",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.patient_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "processor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
                  114
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
          "name": "state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.country_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.state_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "patientRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  116,
                  105,
                  101,
                  110,
                  116,
                  82,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.submitter_address",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.patient_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.patient_record_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "processedClaim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  101,
                  100,
                  67,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "arg",
                "path": "processorAddress"
              },
              {
                "kind": "arg",
                "path": "processorCountIndex"
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
          "name": "processorAddress",
          "type": "pubkey"
        },
        {
          "name": "processorCountIndex",
          "type": "u64"
        },
        {
          "name": "denialReason",
          "type": "string"
        }
      ]
    },
    {
      "name": "denyClaimWithAllRecords",
      "discriminator": [
        56,
        22,
        183,
        93,
        33,
        99,
        251,
        67
      ],
      "accounts": [
        {
          "name": "processorStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
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
          "name": "claimQueue",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109,
                  81,
                  117,
                  101,
                  117,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "submitter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  98,
                  109,
                  105,
                  116,
                  116,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "claim.submitter_address",
                "account": "claim"
              }
            ]
          }
        },
        {
          "name": "patient",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  116,
                  105,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "claim.submitter_address",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.patient_index",
                "account": "claim"
              }
            ]
          }
        },
        {
          "name": "processor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
                  114
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
          "name": "state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "claim.country_index",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.state_index",
                "account": "claim"
              }
            ]
          }
        },
        {
          "name": "patientRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  116,
                  105,
                  101,
                  110,
                  116,
                  82,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "claim.submitter_address",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.patient_index",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.patient_record_index",
                "account": "claim"
              }
            ]
          }
        },
        {
          "name": "hospital",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  111,
                  115,
                  112,
                  105,
                  116,
                  97,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "claim.country_index",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.state_index",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.hospital_index",
                "account": "claim"
              }
            ]
          }
        },
        {
          "name": "hospitalRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  111,
                  115,
                  112,
                  105,
                  116,
                  97,
                  108,
                  82,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "claim.country_index",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.state_index",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.hospital_index",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.hospital_record_index",
                "account": "claim"
              }
            ]
          }
        },
        {
          "name": "insuranceCompany",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  110,
                  115,
                  117,
                  114,
                  97,
                  110,
                  99,
                  101,
                  67,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "claim.insurance_company_index",
                "account": "claim"
              }
            ]
          }
        },
        {
          "name": "insuranceCompanyRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  110,
                  115,
                  117,
                  114,
                  97,
                  110,
                  99,
                  101,
                  67,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121,
                  82,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "claim.insurance_company_index",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.insurance_company_record_index",
                "account": "claim"
              }
            ]
          }
        },
        {
          "name": "processedClaim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  101,
                  100,
                  67,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "account",
                "path": "signer"
              },
              {
                "kind": "account",
                "path": "processor.processed_claim_count",
                "account": "processorAccount"
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
        },
        {
          "name": "claim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "arg",
                "path": "submitterAddress"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "submitterAddress",
          "type": "pubkey"
        },
        {
          "name": "denialReason",
          "type": "string"
        }
      ]
    },
    {
      "name": "dropDenialHammer",
      "discriminator": [
        34,
        21,
        25,
        158,
        28,
        34,
        70,
        206
      ],
      "accounts": [
        {
          "name": "ceo",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  52,
                  97,
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
          "name": "processorStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
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
          "name": "claimQueue",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109,
                  81,
                  117,
                  101,
                  117,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "processor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
                  114
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
      "name": "editClaimQueueSize",
      "discriminator": [
        37,
        64,
        48,
        106,
        233,
        140,
        81,
        229
      ],
      "accounts": [
        {
          "name": "ceo",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  52,
                  97,
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
          "name": "claimQueue",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109,
                  81,
                  117,
                  101,
                  117,
                  101
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
          "name": "newSizeLimit",
          "type": "u32"
        }
      ]
    },
    {
      "name": "editHospital",
      "discriminator": [
        115,
        119,
        204,
        157,
        248,
        255,
        62,
        235
      ],
      "accounts": [
        {
          "name": "ceo",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  52,
                  97,
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
          "name": "hospitalStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  111,
                  115,
                  112,
                  105,
                  116,
                  97,
                  108,
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
          "name": "state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "arg",
                "path": "countryIndex"
              },
              {
                "kind": "arg",
                "path": "stateIndex"
              }
            ]
          }
        },
        {
          "name": "hospital",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  111,
                  115,
                  112,
                  105,
                  116,
                  97,
                  108
                ]
              },
              {
                "kind": "arg",
                "path": "countryIndex"
              },
              {
                "kind": "arg",
                "path": "stateIndex"
              },
              {
                "kind": "arg",
                "path": "hospitalIndex"
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
          "name": "countryIndex",
          "type": "u16"
        },
        {
          "name": "stateIndex",
          "type": "u32"
        },
        {
          "name": "hospitalIndex",
          "type": "u32"
        },
        {
          "name": "isActive",
          "type": "bool"
        },
        {
          "name": "hospitalType",
          "type": "u8"
        },
        {
          "name": "hospitalLongitude",
          "type": "f64"
        },
        {
          "name": "hospitalLatitude",
          "type": "f64"
        },
        {
          "name": "hospitalName",
          "type": "string"
        },
        {
          "name": "hospitalAddress",
          "type": "string"
        },
        {
          "name": "hospitalCity",
          "type": "string"
        },
        {
          "name": "hospitalZipCode",
          "type": "u32"
        },
        {
          "name": "hospitalPhoneNumber",
          "type": "u128"
        },
        {
          "name": "note",
          "type": "string"
        }
      ]
    },
    {
      "name": "editInsuranceCompany",
      "discriminator": [
        4,
        38,
        66,
        205,
        26,
        229,
        25,
        167
      ],
      "accounts": [
        {
          "name": "ceo",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  52,
                  97,
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
          "name": "insuranceCompanyStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  110,
                  115,
                  117,
                  114,
                  97,
                  110,
                  99,
                  101,
                  67,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121,
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
          "name": "insuranceCompany",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  110,
                  115,
                  117,
                  114,
                  97,
                  110,
                  99,
                  101,
                  67,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121
                ]
              },
              {
                "kind": "arg",
                "path": "insuranceCompanyIndex"
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
          "name": "insuranceCompanyIndex",
          "type": "u16"
        },
        {
          "name": "isActive",
          "type": "bool"
        },
        {
          "name": "insuranceCompanyName",
          "type": "string"
        },
        {
          "name": "note",
          "type": "string"
        }
      ]
    },
    {
      "name": "editProcessedClaimAndAllRecords",
      "discriminator": [
        91,
        232,
        149,
        64,
        246,
        118,
        169,
        47
      ],
      "accounts": [
        {
          "name": "ceo",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  52,
                  97,
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
          "name": "processorStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
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
          "name": "processedClaim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  101,
                  100,
                  67,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "arg",
                "path": "processorAddress"
              },
              {
                "kind": "arg",
                "path": "processorCountIndex"
              }
            ]
          }
        },
        {
          "name": "submitter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  98,
                  109,
                  105,
                  116,
                  116,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.submitter_address",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "patient",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  116,
                  105,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.submitter_address",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.patient_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "processor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
                  114
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
          "name": "state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.country_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.state_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "patientRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  116,
                  105,
                  101,
                  110,
                  116,
                  82,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.submitter_address",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.patient_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.patient_record_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "hospital",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  111,
                  115,
                  112,
                  105,
                  116,
                  97,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.country_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.state_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.hospital_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "hospitalRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  111,
                  115,
                  112,
                  105,
                  116,
                  97,
                  108,
                  82,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.country_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.state_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.hospital_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.hospital_record_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "insuranceCompany",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  110,
                  115,
                  117,
                  114,
                  97,
                  110,
                  99,
                  101,
                  67,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.insurance_company_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "insuranceCompanyRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  110,
                  115,
                  117,
                  114,
                  97,
                  110,
                  99,
                  101,
                  67,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121,
                  82,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.insurance_company_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.insurance_company_record_index",
                "account": "processedClaim"
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
          "name": "processorAddress",
          "type": "pubkey"
        },
        {
          "name": "processorCountIndex",
          "type": "u64"
        },
        {
          "name": "hospitalBillInvoiceNumber",
          "type": "string"
        },
        {
          "name": "claimNote",
          "type": "string"
        },
        {
          "name": "claimAmount",
          "type": "u64"
        },
        {
          "name": "ailment",
          "type": "string"
        }
      ]
    },
    {
      "name": "editProcessedClaimAndPatientRecord",
      "discriminator": [
        21,
        160,
        106,
        210,
        150,
        27,
        253,
        172
      ],
      "accounts": [
        {
          "name": "ceo",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  52,
                  97,
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
          "name": "processorStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
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
          "name": "patient",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  116,
                  105,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.submitter_address",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.patient_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "processedClaim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  101,
                  100,
                  67,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "arg",
                "path": "processorAddress"
              },
              {
                "kind": "arg",
                "path": "processorCountIndex"
              }
            ]
          }
        },
        {
          "name": "patientRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  116,
                  105,
                  101,
                  110,
                  116,
                  82,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.submitter_address",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.patient_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.patient_record_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "hospital",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  111,
                  115,
                  112,
                  105,
                  116,
                  97,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.country_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.state_index",
                "account": "processedClaim"
              },
              {
                "kind": "arg",
                "path": "hospitalIndex"
              }
            ]
          }
        },
        {
          "name": "insuranceCompany",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  110,
                  115,
                  117,
                  114,
                  97,
                  110,
                  99,
                  101,
                  67,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121
                ]
              },
              {
                "kind": "arg",
                "path": "insuranceCompanyIndex"
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
          "name": "processorAddress",
          "type": "pubkey"
        },
        {
          "name": "processorCountIndex",
          "type": "u64"
        },
        {
          "name": "hospitalIndex",
          "type": "u32"
        },
        {
          "name": "insuranceCompanyIndex",
          "type": "u16"
        },
        {
          "name": "hospitalBillInvoiceNumber",
          "type": "string"
        },
        {
          "name": "claimNote",
          "type": "string"
        },
        {
          "name": "claimAmount",
          "type": "u64"
        },
        {
          "name": "ailment",
          "type": "string"
        }
      ]
    },
    {
      "name": "initializeM4aProtocolAndClaimQueue",
      "discriminator": [
        23,
        197,
        212,
        129,
        140,
        39,
        194,
        6
      ],
      "accounts": [
        {
          "name": "m4aProtocol",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  52,
                  97,
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
          "name": "processorStats",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
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
          "name": "claimQueue",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109,
                  81,
                  117,
                  101,
                  117,
                  101
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
      "name": "initializeM4aProtocolCeoAccount",
      "discriminator": [
        60,
        4,
        205,
        243,
        123,
        39,
        91,
        101
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
                  109,
                  52,
                  97,
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
      "name": "initializeProtocolStats",
      "discriminator": [
        103,
        193,
        97,
        212,
        182,
        219,
        67,
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
                  109,
                  52,
                  97,
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
          "name": "processorStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
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
          "name": "hospitalStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  111,
                  115,
                  112,
                  105,
                  116,
                  97,
                  108,
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
          "name": "insuranceCompanyStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  110,
                  115,
                  117,
                  114,
                  97,
                  110,
                  99,
                  101,
                  67,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121,
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
      "args": []
    },
    {
      "name": "maxDenyInProgressClaim",
      "discriminator": [
        133,
        176,
        73,
        245,
        40,
        172,
        118,
        101
      ],
      "accounts": [
        {
          "name": "ceo",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  52,
                  97,
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
          "name": "processorStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
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
          "name": "claimQueue",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109,
                  81,
                  117,
                  101,
                  117,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "submitter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  98,
                  109,
                  105,
                  116,
                  116,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "claim.submitter_address",
                "account": "claim"
              }
            ]
          }
        },
        {
          "name": "patient",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  116,
                  105,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "claim.submitter_address",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.patient_index",
                "account": "claim"
              }
            ]
          }
        },
        {
          "name": "adminProcessor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
                  114
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
          "name": "claimProcessor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "claim.processor_address",
                "account": "claim"
              }
            ]
          }
        },
        {
          "name": "claim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "arg",
                "path": "submitterAddress"
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
          "name": "submitterAddress",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "maxDenyPendingClaim",
      "discriminator": [
        136,
        96,
        210,
        225,
        140,
        50,
        242,
        193
      ],
      "accounts": [
        {
          "name": "ceo",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  52,
                  97,
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
          "name": "processorStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
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
          "name": "claimQueue",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109,
                  81,
                  117,
                  101,
                  117,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "submitter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  98,
                  109,
                  105,
                  116,
                  116,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "claim.submitter_address",
                "account": "claim"
              }
            ]
          }
        },
        {
          "name": "patient",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  116,
                  105,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "claim.submitter_address",
                "account": "claim"
              },
              {
                "kind": "account",
                "path": "claim.patient_index",
                "account": "claim"
              }
            ]
          }
        },
        {
          "name": "adminProcessor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
                  114
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
          "name": "claim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "arg",
                "path": "submitterAddress"
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
          "name": "submitterAddress",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "passOnM4aProtocolCeo",
      "discriminator": [
        67,
        255,
        102,
        212,
        129,
        66,
        122,
        48
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
                  109,
                  52,
                  97,
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
      "name": "reassignClaimToNewProcessor",
      "discriminator": [
        177,
        208,
        67,
        161,
        190,
        2,
        12,
        163
      ],
      "accounts": [
        {
          "name": "processorStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
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
          "name": "ceo",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  52,
                  97,
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
          "name": "claim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "arg",
                "path": "submitterAddress"
              }
            ]
          }
        },
        {
          "name": "newProcessor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
                  114
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
          "name": "oldProcessor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "claim.processor_address",
                "account": "claim"
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
          "name": "submitterAddress",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "revokeApproval",
      "discriminator": [
        44,
        51,
        184,
        108,
        182,
        202,
        20,
        53
      ],
      "accounts": [
        {
          "name": "ceo",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  52,
                  97,
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
          "name": "processorStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
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
          "name": "submitter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  98,
                  109,
                  105,
                  116,
                  116,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.submitter_address",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "processor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
                  114
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
          "name": "patient",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  116,
                  105,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.submitter_address",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.patient_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.country_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.state_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "patientRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  116,
                  105,
                  101,
                  110,
                  116,
                  82,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.submitter_address",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.patient_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.patient_record_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "hospital",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  111,
                  115,
                  112,
                  105,
                  116,
                  97,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.country_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.state_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.hospital_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "hospitalRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  111,
                  115,
                  112,
                  105,
                  116,
                  97,
                  108,
                  82,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.country_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.state_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.hospital_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.hospital_record_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "insuranceCompany",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  110,
                  115,
                  117,
                  114,
                  97,
                  110,
                  99,
                  101,
                  67,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.insurance_company_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "insuranceCompanyRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  110,
                  115,
                  117,
                  114,
                  97,
                  110,
                  99,
                  101,
                  67,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121,
                  82,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.insurance_company_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.insurance_company_record_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "processedClaim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  101,
                  100,
                  67,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "arg",
                "path": "processorAddress"
              },
              {
                "kind": "arg",
                "path": "processorCountIndex"
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
          "name": "processorAddress",
          "type": "pubkey"
        },
        {
          "name": "processorCountIndex",
          "type": "u64"
        },
        {
          "name": "denialReason",
          "type": "string"
        }
      ]
    },
    {
      "name": "setClaimQueueFlag",
      "discriminator": [
        55,
        147,
        50,
        117,
        195,
        14,
        212,
        51
      ],
      "accounts": [
        {
          "name": "ceo",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  52,
                  97,
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
          "name": "claimQueue",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109,
                  81,
                  117,
                  101,
                  117,
                  101
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
      "name": "setPatientFlag",
      "discriminator": [
        170,
        72,
        35,
        174,
        78,
        76,
        36,
        12
      ],
      "accounts": [
        {
          "name": "submitter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  98,
                  109,
                  105,
                  116,
                  116,
                  101,
                  114
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
          "name": "patient",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  116,
                  105,
                  101,
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
                "path": "patientIndex"
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
          "name": "patientIndex",
          "type": "u8"
        },
        {
          "name": "isEnabled",
          "type": "bool"
        }
      ]
    },
    {
      "name": "setProcessorAccountActiveFlag",
      "discriminator": [
        149,
        249,
        71,
        86,
        54,
        211,
        20,
        155
      ],
      "accounts": [
        {
          "name": "ceo",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  52,
                  97,
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
          "name": "processorStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
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
          "name": "processor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
                  114
                ]
              },
              {
                "kind": "arg",
                "path": "processorAddress"
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
          "name": "processorAddress",
          "type": "pubkey"
        },
        {
          "name": "isActive",
          "type": "bool"
        }
      ]
    },
    {
      "name": "setProcessorAccountPrivilege",
      "discriminator": [
        169,
        124,
        160,
        57,
        28,
        197,
        230,
        45
      ],
      "accounts": [
        {
          "name": "ceo",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  52,
                  97,
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
          "name": "processorStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
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
          "name": "processor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
                  114
                ]
              },
              {
                "kind": "arg",
                "path": "processorAddress"
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
          "name": "processorAddress",
          "type": "pubkey"
        },
        {
          "name": "isSuperAdmin",
          "type": "bool"
        }
      ]
    },
    {
      "name": "setProcessorToNotProcessingClaimState",
      "discriminator": [
        114,
        192,
        34,
        1,
        111,
        178,
        15,
        99
      ],
      "accounts": [
        {
          "name": "processorStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
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
          "name": "ceo",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  52,
                  97,
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
          "name": "adminProcessor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
                  114
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
          "name": "processor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
                  114
                ]
              },
              {
                "kind": "arg",
                "path": "processorAddress"
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
          "name": "processorAddress",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "submitClaimToQueue",
      "discriminator": [
        171,
        0,
        76,
        93,
        251,
        217,
        176,
        182
      ],
      "accounts": [
        {
          "name": "submitter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  98,
                  109,
                  105,
                  116,
                  116,
                  101,
                  114
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
          "name": "patient",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  116,
                  105,
                  101,
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
                "path": "patientIndex"
              }
            ]
          }
        },
        {
          "name": "claimQueue",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109,
                  81,
                  117,
                  101,
                  117,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "claim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109
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
          "name": "userUsdcAta",
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
                "kind": "const",
                "value": [
                  59,
                  68,
                  44,
                  179,
                  145,
                  33,
                  87,
                  241,
                  58,
                  147,
                  61,
                  1,
                  52,
                  40,
                  45,
                  3,
                  43,
                  95,
                  254,
                  205,
                  1,
                  162,
                  219,
                  241,
                  183,
                  121,
                  6,
                  8,
                  223,
                  0,
                  46,
                  167
                ]
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
          "name": "feeRecipientUsdcAta",
          "writable": true,
          "address": "7onyD3ypcQo5rQLZFGjhbGRhTdirwBzBhQn9whKg1nXx"
        },
        {
          "name": "usdcMint",
          "address": "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"
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
          "name": "patientIndex",
          "type": "u8"
        },
        {
          "name": "countryIndex",
          "type": "u16"
        },
        {
          "name": "stateIndex",
          "type": "u32"
        },
        {
          "name": "hospitalIndex",
          "type": "i32"
        },
        {
          "name": "hospitalType",
          "type": "u8"
        },
        {
          "name": "hospitalName",
          "type": "string"
        },
        {
          "name": "hospitalAddress",
          "type": "string"
        },
        {
          "name": "hospitalCity",
          "type": "string"
        },
        {
          "name": "hospitalZipCode",
          "type": "u32"
        },
        {
          "name": "hospitalPhoneNumber",
          "type": "u128"
        },
        {
          "name": "hospitalBillInvoiceNumber",
          "type": "string"
        },
        {
          "name": "note",
          "type": "string"
        },
        {
          "name": "claimAmount",
          "type": "u64"
        },
        {
          "name": "ailment",
          "type": "string"
        },
        {
          "name": "insuranceCompanyIndex",
          "type": "i16"
        },
        {
          "name": "insuranceCompanyName",
          "type": "string"
        }
      ]
    },
    {
      "name": "unassignClaimFromProcessor",
      "discriminator": [
        110,
        245,
        51,
        77,
        9,
        200,
        50,
        190
      ],
      "accounts": [
        {
          "name": "processorStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
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
          "name": "ceo",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  52,
                  97,
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
          "name": "claim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "arg",
                "path": "submitterAddress"
              }
            ]
          }
        },
        {
          "name": "adminProcessor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
                  114
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
          "name": "oldProcessor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "claim.processor_address",
                "account": "claim"
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
          "name": "submitterAddress",
          "type": "pubkey"
        }
      ]
    },
    {
      "name": "undenyClaimAndCreateHospitalAndInsuranceCompanyRecords",
      "discriminator": [
        1,
        247,
        179,
        148,
        64,
        177,
        32,
        49
      ],
      "accounts": [
        {
          "name": "ceo",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  52,
                  97,
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
          "name": "processorStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
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
          "name": "submitter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  98,
                  109,
                  105,
                  116,
                  116,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.submitter_address",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "patient",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  116,
                  105,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.submitter_address",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.patient_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.country_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.state_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "patientRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  116,
                  105,
                  101,
                  110,
                  116,
                  82,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.submitter_address",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.patient_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.patient_record_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "processor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
                  114
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
          "name": "hospital",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  111,
                  115,
                  112,
                  105,
                  116,
                  97,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.country_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.state_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.hospital_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "hospitalRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  111,
                  115,
                  112,
                  105,
                  116,
                  97,
                  108,
                  82,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.country_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.state_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.hospital_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "hospital.record_count",
                "account": "hospital"
              }
            ]
          }
        },
        {
          "name": "insuranceCompany",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  110,
                  115,
                  117,
                  114,
                  97,
                  110,
                  99,
                  101,
                  67,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.insurance_company_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "insuranceCompanyRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  110,
                  115,
                  117,
                  114,
                  97,
                  110,
                  99,
                  101,
                  67,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121,
                  82,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.insurance_company_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "insurance_company.record_count",
                "account": "insuranceCompany"
              }
            ]
          }
        },
        {
          "name": "processedClaim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  101,
                  100,
                  67,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "arg",
                "path": "processorAddress"
              },
              {
                "kind": "arg",
                "path": "processorCountIndex"
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
          "name": "processorAddress",
          "type": "pubkey"
        },
        {
          "name": "processorCountIndex",
          "type": "u64"
        }
      ]
    },
    {
      "name": "undenyClaimWithAllRecords",
      "discriminator": [
        204,
        86,
        184,
        65,
        210,
        223,
        79,
        112
      ],
      "accounts": [
        {
          "name": "ceo",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  109,
                  52,
                  97,
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
          "name": "processorStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
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
          "name": "submitter",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  117,
                  98,
                  109,
                  105,
                  116,
                  116,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.submitter_address",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "patient",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  116,
                  105,
                  101,
                  110,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.submitter_address",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.patient_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "processor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
                  114
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
          "name": "state",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.country_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.state_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "patientRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  97,
                  116,
                  105,
                  101,
                  110,
                  116,
                  82,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.submitter_address",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.patient_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.patient_record_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "hospital",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  111,
                  115,
                  112,
                  105,
                  116,
                  97,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.country_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.state_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.hospital_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "hospitalRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  104,
                  111,
                  115,
                  112,
                  105,
                  116,
                  97,
                  108,
                  82,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.country_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.state_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.hospital_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.hospital_record_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "insuranceCompany",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  110,
                  115,
                  117,
                  114,
                  97,
                  110,
                  99,
                  101,
                  67,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.insurance_company_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "insuranceCompanyRecord",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  105,
                  110,
                  115,
                  117,
                  114,
                  97,
                  110,
                  99,
                  101,
                  67,
                  111,
                  109,
                  112,
                  97,
                  110,
                  121,
                  82,
                  101,
                  99,
                  111,
                  114,
                  100
                ]
              },
              {
                "kind": "account",
                "path": "processed_claim.insurance_company_index",
                "account": "processedClaim"
              },
              {
                "kind": "account",
                "path": "processed_claim.insurance_company_record_index",
                "account": "processedClaim"
              }
            ]
          }
        },
        {
          "name": "processedClaim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  101,
                  100,
                  67,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "arg",
                "path": "processorAddress"
              },
              {
                "kind": "arg",
                "path": "processorCountIndex"
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
          "name": "processorAddress",
          "type": "pubkey"
        },
        {
          "name": "processorCountIndex",
          "type": "u64"
        }
      ]
    },
    {
      "name": "updateClaimHospitalIndex",
      "discriminator": [
        250,
        165,
        150,
        125,
        88,
        226,
        229,
        143
      ],
      "accounts": [
        {
          "name": "processorStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
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
          "name": "claim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "arg",
                "path": "submitterAddress"
              }
            ]
          }
        },
        {
          "name": "processor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "claim.processor_address",
                "account": "claim"
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
          "name": "submitterAddress",
          "type": "pubkey"
        },
        {
          "name": "hospitalIndex",
          "type": "u32"
        }
      ]
    },
    {
      "name": "updateClaimInsuranceCompanyIndex",
      "discriminator": [
        92,
        15,
        89,
        227,
        71,
        91,
        77,
        125
      ],
      "accounts": [
        {
          "name": "processorStats",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
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
          "name": "claim",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  99,
                  108,
                  97,
                  105,
                  109
                ]
              },
              {
                "kind": "arg",
                "path": "submitterAddress"
              }
            ]
          }
        },
        {
          "name": "processor",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  99,
                  101,
                  115,
                  115,
                  111,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "claim.processor_address",
                "account": "claim"
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
          "name": "submitterAddress",
          "type": "pubkey"
        },
        {
          "name": "insuranceCompanyIndex",
          "type": "u16"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "claim",
      "discriminator": [
        155,
        70,
        22,
        176,
        123,
        215,
        246,
        102
      ]
    },
    {
      "name": "claimQueue",
      "discriminator": [
        150,
        219,
        116,
        150,
        46,
        174,
        101,
        6
      ]
    },
    {
      "name": "hospital",
      "discriminator": [
        150,
        59,
        177,
        217,
        93,
        234,
        181,
        75
      ]
    },
    {
      "name": "hospitalRecord",
      "discriminator": [
        71,
        206,
        26,
        165,
        241,
        202,
        80,
        174
      ]
    },
    {
      "name": "hospitalStats",
      "discriminator": [
        187,
        20,
        152,
        42,
        250,
        151,
        180,
        58
      ]
    },
    {
      "name": "insuranceCompany",
      "discriminator": [
        206,
        144,
        76,
        144,
        67,
        5,
        189,
        8
      ]
    },
    {
      "name": "insuranceCompanyRecord",
      "discriminator": [
        144,
        168,
        167,
        246,
        242,
        119,
        141,
        236
      ]
    },
    {
      "name": "insuranceCompanyStats",
      "discriminator": [
        90,
        84,
        190,
        178,
        75,
        227,
        193,
        40
      ]
    },
    {
      "name": "m4aProtocol",
      "discriminator": [
        45,
        67,
        68,
        65,
        88,
        219,
        91,
        211
      ]
    },
    {
      "name": "m4aProtocolCeo",
      "discriminator": [
        62,
        146,
        189,
        188,
        16,
        118,
        136,
        203
      ]
    },
    {
      "name": "patientAccount",
      "discriminator": [
        235,
        103,
        40,
        224,
        205,
        208,
        192,
        46
      ]
    },
    {
      "name": "patientRecord",
      "discriminator": [
        66,
        65,
        121,
        175,
        222,
        160,
        195,
        11
      ]
    },
    {
      "name": "processedClaim",
      "discriminator": [
        248,
        20,
        72,
        251,
        87,
        226,
        117,
        157
      ]
    },
    {
      "name": "processorAccount",
      "discriminator": [
        221,
        222,
        208,
        157,
        34,
        126,
        131,
        170
      ]
    },
    {
      "name": "processorStats",
      "discriminator": [
        106,
        88,
        126,
        7,
        84,
        226,
        229,
        71
      ]
    },
    {
      "name": "stateAccount",
      "discriminator": [
        142,
        247,
        54,
        95,
        85,
        133,
        249,
        103
      ]
    },
    {
      "name": "submitterAccount",
      "discriminator": [
        63,
        101,
        7,
        184,
        5,
        175,
        79,
        161
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "hospitalTypeInvalid",
      "msg": "Hospital type must be General, Dental, Vision, or Mental (0,1,2,3)"
    }
  ],
  "types": [
    {
      "name": "claim",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "status",
            "type": "u8"
          },
          {
            "name": "isPatientRecordCreated",
            "type": "bool"
          },
          {
            "name": "isHospitalRecordCreated",
            "type": "bool"
          },
          {
            "name": "isInsuranceCompanyRecordCreated",
            "type": "bool"
          },
          {
            "name": "patientRecordIndex",
            "type": "u32"
          },
          {
            "name": "hospitalRecordIndex",
            "type": "u64"
          },
          {
            "name": "insuranceCompanyRecordIndex",
            "type": "u64"
          },
          {
            "name": "submitterAddress",
            "type": "pubkey"
          },
          {
            "name": "processorAddress",
            "type": "pubkey"
          },
          {
            "name": "patientIndex",
            "type": "u8"
          },
          {
            "name": "countryIndex",
            "type": "u16"
          },
          {
            "name": "stateIndex",
            "type": "u32"
          },
          {
            "name": "hospitalIndex",
            "type": "i32"
          },
          {
            "name": "hospitalType",
            "type": "u8"
          },
          {
            "name": "hospitalName",
            "type": "string"
          },
          {
            "name": "hospitalAddress",
            "type": "string"
          },
          {
            "name": "hospitalCity",
            "type": "string"
          },
          {
            "name": "hospitalZipCode",
            "type": "u32"
          },
          {
            "name": "hospitalPhoneNumber",
            "type": "u128"
          },
          {
            "name": "hospitalBillInvoiceNumber",
            "type": "string"
          },
          {
            "name": "note",
            "type": "string"
          },
          {
            "name": "claimAmount",
            "type": "u64"
          },
          {
            "name": "ailment",
            "type": "string"
          },
          {
            "name": "submittedTime",
            "type": "u64"
          },
          {
            "name": "insuranceCompanyIndex",
            "type": "i16"
          },
          {
            "name": "insuranceCompanyName",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "claimQueue",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "submittedClaimCount",
            "type": "u64"
          },
          {
            "name": "currentClaimQueueCount",
            "type": "u32"
          },
          {
            "name": "queueSizeLimit",
            "type": "u32"
          },
          {
            "name": "enabled",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "hospital",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u32"
          },
          {
            "name": "isActive",
            "type": "bool"
          },
          {
            "name": "countryIndex",
            "type": "u16"
          },
          {
            "name": "stateIndex",
            "type": "u32"
          },
          {
            "name": "hospitalIndex",
            "type": "u32"
          },
          {
            "name": "hospitalType",
            "type": "u8"
          },
          {
            "name": "hospitalLongitude",
            "type": "f64"
          },
          {
            "name": "hospitalLatitude",
            "type": "f64"
          },
          {
            "name": "hospitalName",
            "type": "string"
          },
          {
            "name": "hospitalAddress",
            "type": "string"
          },
          {
            "name": "hospitalCity",
            "type": "string"
          },
          {
            "name": "hospitalZipCode",
            "type": "u32"
          },
          {
            "name": "hospitalPhoneNumber",
            "type": "u128"
          },
          {
            "name": "note",
            "type": "string"
          },
          {
            "name": "recordCount",
            "type": "u64"
          },
          {
            "name": "editedRecordCount",
            "type": "u32"
          },
          {
            "name": "approvedClaimAmount",
            "type": "u64"
          },
          {
            "name": "approvedClaimCount",
            "type": "u64"
          },
          {
            "name": "deniedClaimCount",
            "type": "u64"
          },
          {
            "name": "undeniedClaimCount",
            "type": "u64"
          },
          {
            "name": "submittedAppealCount",
            "type": "u64"
          },
          {
            "name": "deniedAppealCount",
            "type": "u64"
          },
          {
            "name": "revokedApprovalCount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "hospitalRecord",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "recordId",
            "type": "u64"
          },
          {
            "name": "claimId",
            "type": "u64"
          },
          {
            "name": "status",
            "type": "u8"
          },
          {
            "name": "denialReason",
            "type": "string"
          },
          {
            "name": "appealReason",
            "type": "string"
          },
          {
            "name": "submitterAddress",
            "type": "pubkey"
          },
          {
            "name": "patientIndex",
            "type": "u8"
          },
          {
            "name": "processorAddress",
            "type": "pubkey"
          },
          {
            "name": "processorCountIndex",
            "type": "u64"
          },
          {
            "name": "countryIndex",
            "type": "u16"
          },
          {
            "name": "stateIndex",
            "type": "u32"
          },
          {
            "name": "insuranceCompanyIndex",
            "type": "u16"
          },
          {
            "name": "hospitalBillInvoiceNumber",
            "type": "string"
          },
          {
            "name": "claimAmount",
            "type": "u64"
          },
          {
            "name": "ailment",
            "type": "string"
          },
          {
            "name": "note",
            "type": "string"
          },
          {
            "name": "submittedTime",
            "type": "u64"
          },
          {
            "name": "processedTime",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "hospitalStats",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "hospitalCount",
            "type": "u32"
          },
          {
            "name": "generalHospitalCount",
            "type": "u32"
          },
          {
            "name": "dentalHospitalCount",
            "type": "u32"
          },
          {
            "name": "visionHospitalCount",
            "type": "u32"
          },
          {
            "name": "mentalHospitalCount",
            "type": "u32"
          },
          {
            "name": "editedHospitalCount",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "insuranceCompany",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u16"
          },
          {
            "name": "isActive",
            "type": "bool"
          },
          {
            "name": "insuranceCompanyName",
            "type": "string"
          },
          {
            "name": "note",
            "type": "string"
          },
          {
            "name": "recordCount",
            "type": "u64"
          },
          {
            "name": "editedRecordCount",
            "type": "u32"
          },
          {
            "name": "approvedClaimAmount",
            "type": "u64"
          },
          {
            "name": "approvedClaimCount",
            "type": "u64"
          },
          {
            "name": "deniedClaimCount",
            "type": "u64"
          },
          {
            "name": "undeniedClaimCount",
            "type": "u64"
          },
          {
            "name": "submittedAppealCount",
            "type": "u64"
          },
          {
            "name": "deniedAppealCount",
            "type": "u64"
          },
          {
            "name": "revokedApprovalCount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "insuranceCompanyRecord",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "recordId",
            "type": "u64"
          },
          {
            "name": "claimId",
            "type": "u64"
          },
          {
            "name": "status",
            "type": "u8"
          },
          {
            "name": "denialReason",
            "type": "string"
          },
          {
            "name": "appealReason",
            "type": "string"
          },
          {
            "name": "submitterAddress",
            "type": "pubkey"
          },
          {
            "name": "patientIndex",
            "type": "u8"
          },
          {
            "name": "processorAddress",
            "type": "pubkey"
          },
          {
            "name": "processorCountIndex",
            "type": "u64"
          },
          {
            "name": "countryIndex",
            "type": "u16"
          },
          {
            "name": "stateIndex",
            "type": "u32"
          },
          {
            "name": "hospitalIndex",
            "type": "u32"
          },
          {
            "name": "hospitalBillInvoiceNumber",
            "type": "string"
          },
          {
            "name": "claimAmount",
            "type": "u64"
          },
          {
            "name": "ailment",
            "type": "string"
          },
          {
            "name": "note",
            "type": "string"
          },
          {
            "name": "submittedTime",
            "type": "u64"
          },
          {
            "name": "processedTime",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "insuranceCompanyStats",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "initializedInsuranceCompanyCount",
            "type": "u16"
          },
          {
            "name": "additionalInsuranceCompanyCount",
            "type": "u16"
          },
          {
            "name": "editedInsuranceCompanyCount",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "m4aProtocol",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "m4aProtocolInitiatorAddress",
            "type": "pubkey"
          },
          {
            "name": "submitterAccountTotal",
            "type": "u64"
          },
          {
            "name": "patientAccountTotal",
            "type": "u64"
          },
          {
            "name": "stateAccountTotal",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "m4aProtocolCeo",
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
      "name": "patientAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "submitterAddress",
            "type": "pubkey"
          },
          {
            "name": "isActive",
            "type": "bool"
          },
          {
            "name": "patientFirstName",
            "type": "string"
          },
          {
            "name": "patientLastName",
            "type": "string"
          },
          {
            "name": "recordCount",
            "type": "u32"
          },
          {
            "name": "editedRecordCount",
            "type": "u32"
          },
          {
            "name": "submittedClaimCount",
            "type": "u32"
          },
          {
            "name": "approvedClaimAmount",
            "type": "u64"
          },
          {
            "name": "approvedClaimCount",
            "type": "u32"
          },
          {
            "name": "maxDeniedClaimCount",
            "type": "u32"
          },
          {
            "name": "deniedClaimCount",
            "type": "u32"
          },
          {
            "name": "undeniedClaimCount",
            "type": "u32"
          },
          {
            "name": "submittedAppealCount",
            "type": "u32"
          },
          {
            "name": "deniedAppealCount",
            "type": "u32"
          },
          {
            "name": "revokedApprovalCount",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "patientRecord",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "recordId",
            "type": "u32"
          },
          {
            "name": "claimId",
            "type": "u32"
          },
          {
            "name": "status",
            "type": "u8"
          },
          {
            "name": "patientRecordOnly",
            "type": "bool"
          },
          {
            "name": "denialReason",
            "type": "string"
          },
          {
            "name": "appealReason",
            "type": "string"
          },
          {
            "name": "submitterAddress",
            "type": "pubkey"
          },
          {
            "name": "processorAddress",
            "type": "pubkey"
          },
          {
            "name": "processorCountIndex",
            "type": "u64"
          },
          {
            "name": "countryIndex",
            "type": "u16"
          },
          {
            "name": "stateIndex",
            "type": "u32"
          },
          {
            "name": "hospitalIndex",
            "type": "u32"
          },
          {
            "name": "insuranceCompanyIndex",
            "type": "u16"
          },
          {
            "name": "hospitalBillInvoiceNumber",
            "type": "string"
          },
          {
            "name": "claimAmount",
            "type": "u64"
          },
          {
            "name": "ailment",
            "type": "string"
          },
          {
            "name": "note",
            "type": "string"
          },
          {
            "name": "submittedTime",
            "type": "u64"
          },
          {
            "name": "processedTime",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "processedClaim",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "processedClaimId",
            "type": "u64"
          },
          {
            "name": "claimId",
            "type": "u64"
          },
          {
            "name": "processorCountIndex",
            "type": "u64"
          },
          {
            "name": "status",
            "type": "u8"
          },
          {
            "name": "denialReason",
            "type": "string"
          },
          {
            "name": "appealReason",
            "type": "string"
          },
          {
            "name": "isPatientRecordCreated",
            "type": "bool"
          },
          {
            "name": "isHospitalRecordCreated",
            "type": "bool"
          },
          {
            "name": "isInsuranceCompanyRecordCreated",
            "type": "bool"
          },
          {
            "name": "patientRecordIndex",
            "type": "u32"
          },
          {
            "name": "hospitalRecordIndex",
            "type": "u64"
          },
          {
            "name": "insuranceCompanyRecordIndex",
            "type": "u64"
          },
          {
            "name": "processorAddress",
            "type": "pubkey"
          },
          {
            "name": "submitterAddress",
            "type": "pubkey"
          },
          {
            "name": "patientIndex",
            "type": "u8"
          },
          {
            "name": "countryIndex",
            "type": "u16"
          },
          {
            "name": "stateIndex",
            "type": "u32"
          },
          {
            "name": "hospitalIndex",
            "type": "i32"
          },
          {
            "name": "hospitalType",
            "type": "u8"
          },
          {
            "name": "hospitalName",
            "type": "string"
          },
          {
            "name": "hospitalAddress",
            "type": "string"
          },
          {
            "name": "hospitalCity",
            "type": "string"
          },
          {
            "name": "hospitalZipCode",
            "type": "u32"
          },
          {
            "name": "hospitalPhoneNumber",
            "type": "u128"
          },
          {
            "name": "hospitalBillInvoiceNumber",
            "type": "string"
          },
          {
            "name": "note",
            "type": "string"
          },
          {
            "name": "claimAmount",
            "type": "u64"
          },
          {
            "name": "ailment",
            "type": "string"
          },
          {
            "name": "submittedTime",
            "type": "u64"
          },
          {
            "name": "processedTime",
            "type": "u64"
          },
          {
            "name": "insuranceCompanyIndex",
            "type": "i16"
          },
          {
            "name": "insuranceCompanyName",
            "type": "string"
          }
        ]
      }
    },
    {
      "name": "processorAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "address",
            "type": "pubkey"
          },
          {
            "name": "isActive",
            "type": "bool"
          },
          {
            "name": "isSuperAdmin",
            "type": "bool"
          },
          {
            "name": "isProcessingClaim",
            "type": "bool"
          },
          {
            "name": "submitterAddressOfClaimBeingProcessed",
            "type": "pubkey"
          },
          {
            "name": "createdPatientRecordCount",
            "type": "u64"
          },
          {
            "name": "createdHospitalCount",
            "type": "u64"
          },
          {
            "name": "createdHospitalRecordCount",
            "type": "u64"
          },
          {
            "name": "createdInsuranceCompanyCount",
            "type": "u16"
          },
          {
            "name": "createdInsuranceCompanyRecordCount",
            "type": "u32"
          },
          {
            "name": "processedClaimCount",
            "type": "u64"
          },
          {
            "name": "approvedClaimAmount",
            "type": "u64"
          },
          {
            "name": "approvedClaimCount",
            "type": "u64"
          },
          {
            "name": "maxDeniedClaimCount",
            "type": "u64"
          },
          {
            "name": "deniedClaimCount",
            "type": "u64"
          },
          {
            "name": "undeniedClaimCount",
            "type": "u64"
          },
          {
            "name": "deniedAppealCount",
            "type": "u64"
          },
          {
            "name": "revokedApprovalCount",
            "type": "u64"
          },
          {
            "name": "denialHammerDroppedCount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "processorStats",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "processorAccountTotal",
            "type": "u64"
          },
          {
            "name": "processorActiveAccountTotal",
            "type": "u64"
          },
          {
            "name": "processorSuperAdminAccountTotal",
            "type": "u64"
          },
          {
            "name": "setOrUnsetProcessorOnClaimCount",
            "type": "u64"
          },
          {
            "name": "editedProcessorCount",
            "type": "u32"
          },
          {
            "name": "createdPatientRecordCount",
            "type": "u64"
          },
          {
            "name": "createdHospitalAndInsuranceCompanyRecordsCount",
            "type": "u64"
          },
          {
            "name": "processedClaimCount",
            "type": "u64"
          },
          {
            "name": "editedClaimOrProcessedClaimCount",
            "type": "u64"
          },
          {
            "name": "approvedClaimAmount",
            "type": "u64"
          },
          {
            "name": "approvedClaimCount",
            "type": "u64"
          },
          {
            "name": "maxDeniedClaimCount",
            "type": "u64"
          },
          {
            "name": "deniedClaimCount",
            "type": "u64"
          },
          {
            "name": "undeniedClaimCount",
            "type": "u64"
          },
          {
            "name": "submittedAppealCount",
            "type": "u64"
          },
          {
            "name": "deniedAppealCount",
            "type": "u64"
          },
          {
            "name": "revokedApprovalCount",
            "type": "u64"
          },
          {
            "name": "denialHammerDroppedCount",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "stateAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u32"
          },
          {
            "name": "index",
            "type": "u32"
          },
          {
            "name": "approvedClaimAmount",
            "type": "u64"
          },
          {
            "name": "approvedClaimCount",
            "type": "u64"
          },
          {
            "name": "deniedClaimCount",
            "type": "u64"
          },
          {
            "name": "undeniedClaimCount",
            "type": "u64"
          },
          {
            "name": "submittedAppealCount",
            "type": "u64"
          },
          {
            "name": "deniedAppealCount",
            "type": "u64"
          },
          {
            "name": "revokedApprovalCount",
            "type": "u64"
          },
          {
            "name": "hospitalCount",
            "type": "u32"
          },
          {
            "name": "generalHospitalCount",
            "type": "u32"
          },
          {
            "name": "dentalHospitalCount",
            "type": "u32"
          },
          {
            "name": "visionHospitalCount",
            "type": "u32"
          },
          {
            "name": "mentalHospitalCount",
            "type": "u32"
          },
          {
            "name": "editedHospitalCount",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "submitterAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "address",
            "type": "pubkey"
          },
          {
            "name": "activePatientCount",
            "type": "u8"
          },
          {
            "name": "patientCount",
            "type": "u8"
          },
          {
            "name": "submittedClaimCount",
            "type": "u32"
          },
          {
            "name": "approvedClaimAmount",
            "type": "u64"
          },
          {
            "name": "approvedClaimCount",
            "type": "u32"
          },
          {
            "name": "maxDeniedClaimCount",
            "type": "u32"
          },
          {
            "name": "deniedClaimCount",
            "type": "u32"
          },
          {
            "name": "undeniedClaimCount",
            "type": "u32"
          },
          {
            "name": "submittedAppealCount",
            "type": "u32"
          },
          {
            "name": "deniedAppealCount",
            "type": "u32"
          },
          {
            "name": "revokedApprovalCount",
            "type": "u32"
          }
        ]
      }
    }
  ]
};
