const automodSchema = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "type": "object",
    "properties": {
        "cryptoImages": {
            "type": "object",
            "properties": {
                "block": {
                    "type": "boolean"
                },
                "action": {
                    "type": "string",
                    "enum": ["timeout", "ban", "block", "none"]
                },
                "duration": {
                    "type": "integer",
                    "minimum": 1
                },
                "imageRotation": {
                    "type": "number",
                    "minimum": -360,
                    "maximum": 360
                },
                "keywords": {
                    "type": "array",
                    "items": {
                        "type": "string",
                    },
                    "minItems": 1,
                    "uniqueItems": true
                },
                "threshold": {
                    "type": "integer",
                    "minimum": 1
                }
            },
            "required": [
                "block",
                "action",
                "duration",
                "imageRotation",
                "keywords",
                "threshold"
            ],
            "additionalProperties": false
        },
        "r18Invites": {
            "type": "object",
            "properties": {
                "block": {
                    "type": "boolean"
                },
                "action": {
                    "type": "string",
                    "enum": ["timeout", "ban", "block", "none"]
                },
                "duration": {
                    "type": "integer",
                    "minimum": 1
                },
                "keywords": {
                    "type": "array",
                    "items": {
                        "type": "string",
                    },
                    "minItems": 1,
                    "uniqueItems": true
                },
                "threshold": {
                    "type": "integer",
                    "minimum": 1
                }
            },
            "required": [
                "block",
                "action",
                "duration",
                "imageRotation",
                "keywords",
                "threshold"
            ],
            "additionalProperties": false
        }
    },
    "required": ["cryptoImages", "r18Invites"],
    "additionalProperties": false
}

const generalSchema = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "type": "object",
    "properties": {
        "loggingChannel": {
            "type": "string",
        },
        "adminRoles": {
            "type": "array",
            "items": {
                "type": "string",
            },
            "minItems": 1,
            "uniqueItems": true
        }
    },
    "required": ["loggingChannel", "adminRoles"],
    "additionalProperties": false
}

const regexSchema = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "type": "object",
  "properties": {
    "enhancedRegex": {
      "type": "boolean"
    },
    "regexList": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "regex": {
            "type": "string",
            "minLength": 1
          },
          "action": {
            "type": "string",
            "enum": ["block", "timeout", "delete", "warn", "none"]
          },
          "duration": {
            "type": "integer",
            "minimum": 1
          }
        },
        "required": ["regex", "action"],
        "additionalProperties": false
      },
    }
  },
  "required": ["enhancedRegex", "regexList"],
  "additionalProperties": false
}

module.exports = { automodSchema, generalSchema, regexSchema };