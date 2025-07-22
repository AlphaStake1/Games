The provided content explains how to autofill user data on Helio checkout pages by passing parameters directly in the Pay Link URL.

**Purpose:**
To auto-fill Helio checkout pages from other data sources (e.g., Discord, customer forms) to offer a better user experience.

**Method:**
Simply append parameters and their values to the standard Pay Link URL in the format `parameter=value`. The Pay Link page will then populate the corresponding fields with the provided values.

**Example Pay Link with Parameters:**
`https://www.hel.io/x/zebulivelondonVIP?email=jane%40hel.io&fullName=Jane+Smith&twitterUsername=%40janesmithhelio&streetNumber=1&street=Acacia+Avenue&deliveryAddress=Townsville&city=Bigtown&state=South&areaCode=W1+1AA&phoneNumber=07973999999&productValue=M&network=POLYGON`

**Available Parameters and Values:**

| Parameter       | Value/Description                                                              |
| :-------------- | :----------------------------------------------------------------------------- |
| `email`         | A valid email address                                                          |
| `twitterUsername` | Standard Twitter name required with `@`                                        |
| `fullName`      | Real name of a customer                                                        |
| `streetNumber`  | Street number of a property                                                    |
| `street`        | Street Name                                                                    |
| `deliveryAddress` | Optional Street Name                                                           |
| `city`          | City Name                                                                      |
| `state`         | State or Region Name                                                           |
| `areaCode`      | Area or Postal Code                                                            |
| `phoneNumber`   | Phone Number in local format                                                   |
| `productValue`  | Set using 'Additional Information' setting in pay link setup to capture custom data like shoe size |
| `network`       | Customer Blockchain of choice                                                  |