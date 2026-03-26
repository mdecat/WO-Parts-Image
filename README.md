# WO Parts Image - PCF Control for Dynamics 365 Field Service

A PowerApps Component Framework (PCF) control that lets field technicians identify parts by taking a photo and add them as Work Order Products.

Uses **Claude API vision** to analyze part photos and match them against the Dynamics 365 Product catalog.

## Features

- **Camera capture** - Take a photo of a part directly from phone/tablet using the native camera
- **AI identification** - Claude vision identifies part type, manufacturer, and model/part number from the image
- **Product catalog search** - Searches the D365 Product table for matching products, showing ranked candidates
- **Technician confirmation** - Technician reviews matches and selects the correct product before adding
- **Create new products** - When no match is found, create a new Product directly from the AI identification (pre-filled form), with Field Service inventory type and default price list
- **Work Order Product creation** - Creates an `msdyn_workorderproduct` line item linked to the Work Order

## Installation

1. Download `WOPartsImage_Solution.zip` from the [latest release](https://github.com/mdecat/WO-Parts-Image/releases)
2. In Power Apps, go to **Solutions** > **Import solution**
3. Select the downloaded zip file and follow the import wizard
4. Once imported, open the **Work Order** form in the form editor
5. Add or select a text field (e.g. a custom field like "Product Image App")
6. Switch the field's control to **WO Parts Image**
7. In the control properties, set the **Claude API Key** (get one at [console.anthropic.com](https://console.anthropic.com/settings/keys))
8. Enable the control for **Web**, **Mobile**, and **Tablet**
9. Save and publish the form

## Requirements

- Dynamics 365 Field Service
- Anthropic API key with access to Claude Sonnet

## How It Works

```
Take Photo --> Claude AI Identifies Part --> Search Product Catalog
                                                  |
                                          Match found? ----Yes----> Select & Add to WO
                                                  |
                                                  No
                                                  |
                                          Create New Product --> Add to WO
```

### D365 Entities Used

| Entity | Operation | Purpose |
|---|---|---|
| `product` | Read / Create | Search catalog or create new product |
| `uom` | Read | Default unit of measure |
| `pricelevel` | Read | Default price list |
| `productpricelevel` | Create | Price list item for new products |
| `msdyn_workorder` | Read | Parent Work Order context |
| `msdyn_workorderproduct` | Create | Line item linking product to WO |

### New Products

When no catalog match is found, the technician can create a new product. The control:
- Pre-fills the form with AI-identified name, part number, and description
- Sets `msdyn_fieldserviceproducttype` to **Inventory** (690970000)
- Assigns the product to the default price list
- Creates the Work Order Product line item

## Development

```bash
# Install dependencies
npm install

# Build the control
npm run build

# Deploy to a D365 environment (requires pac CLI authenticated)
cd Solution
dotnet build
pac solution import --path bin/Debug/Solution.zip --environment "https://your-org.crm.dynamics.com/" --force-overwrite --publish-changes
```

## Security Note

For this demo, the Claude API key is passed as a control property (visible in browser). For production use, route API calls through an Azure Function that holds the key in Azure Key Vault.

## Publisher

- **Publisher**: MdeCat
- **Prefix**: mdecat
