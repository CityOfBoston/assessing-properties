# PDF Form Configuration Guide

This directory contains PDF form templates and their field configuration files for the property tax application system.

## Directory Structure

```
forms/
  fy26/
    ├── residential.pdf              # Residential exemption form template
    ├── residential.config.yaml      # Field configuration for residential form
    ├── personal.pdf                 # Personal exemption form template
    ├── personal.config.yaml         # Field configuration for personal form
    ├── abatement_short.pdf          # Abatement form for residential properties
    ├── abatement_short.config.yaml  # Field configuration for short abatement
    ├── abatement_long.pdf           # Abatement form for commercial properties
    └── abatement_long.config.yaml   # Field configuration for long abatement
```

## Configuration File Format

Each PDF has a corresponding `.config.yaml` file that maps property data fields to locations in the PDF.

### Field Modes

There are two modes for field placement:

#### 1. Field Index Mode (for fillable PDF form fields)

Use this when the PDF has fillable form fields. Specify the zero-based index of the field.

```yaml
fields:
  parcel_id:
    mode: field_index
    index: 0  # First fillable field in the PDF
```

#### 2. Bounding Box Mode (for positioning text)

Use this when the PDF is not fillable or you want to place text at specific coordinates.

```yaml
fields:
  owner:
    mode: bounding_box
    x: 100          # X coordinate from left edge
    y: 150          # Y coordinate from top edge (top-left coordinate system)
    width: 300      # Width of bounding box
    height: 20      # Height of bounding box
    auto_size_font: true  # Automatically size font to fit
    max_font_size: 12     # Maximum font size
    min_font_size: 8      # Minimum font size
```

### Coordinate System

**Important**: Configurations use a **top-left** coordinate system for easier measurement:
- Origin (0,0) is at the **top-left** corner
- X increases to the right
- Y increases **downward**
- Standard US Letter: 612 x 792 points (8.5" x 11" at 72 DPI)

The system automatically converts these coordinates to PDF's native bottom-left coordinate system internally.

### Standard Fields

All forms should configure these fields:

- `parcel_id` - Property parcel identifier
- `owner` - Property owner name(s)
- `address` - Property address
- `assessed_value` - Property assessed value

### Barcode Placement

**Barcodes are automatically placed** and do not need configuration:
- Horizontally centered on the page (based on actual page width)
- 25pt from the top edge
- Fixed size: 80pt x 24pt
- Do not include barcode field in YAML config files

Barcode values are generated automatically:
- **Residential Exemption**: parcel_id
- **Personal Exemption**: parcel_id
- **Abatement**: {fiscal_year}{sequence_number} (e.g., "202615001")

## Testing Configuration

Use the local testing utility to verify field placement:

```bash
cd functions
npm run test:pdf -- --form-type=residential --parcel-id=0123456789 --output-path=./test/output/test.pdf
```

Options:
- `--form-type`: residential, personal, or abatement
- `--parcel-id`: Test parcel ID
- `--fiscal-year`: Fiscal year (default: 2026)
- `--output-path`: Where to save the generated PDF (default: `./test/output/test.pdf`)

All test files and generated PDFs are contained in the `test/` folder.

### Testing Workflow

1. Generate a test PDF with sample data
2. Open the PDF and visually inspect field placement
3. Adjust coordinates in the config YAML
4. Repeat until fields are correctly positioned

## Adding New Fiscal Year Forms

When adding forms for a new fiscal year:

1. Create a new directory: `forms/fy{XX}/` (e.g., `fy27`)
2. Add PDF templates for all four form types
3. Copy config files from the previous year
4. Adjust field positions as needed (PDFs may change layout)
5. Test each form with the testing utility

## Form Type Determination

The system automatically selects the appropriate form:

- **Residential Exemption**: Always uses `residential.pdf`
- **Personal Exemption**: Always uses `personal.pdf`
- **Abatement (Short)**: Used for residential properties (type code starts with "1" or "0")
- **Abatement (Long)**: Used for commercial properties (all other type codes)

## Cache Behavior

Generated PDFs are cached per:
- Parcel ID
- Form type
- Fiscal year

Within the same fiscal year, the same PDF is reused for multiple requests, improving performance and ensuring consistency.

## Troubleshooting

### Fields not appearing
- Check coordinate values (remember Y increases downward from top)
- Ensure coordinates are within PDF bounds (0-612 x, 0-792 y)
- For field_index mode, verify the index is correct

### Text cut off
- Increase bounding box width/height
- Enable auto_size_font and adjust min/max font sizes
- Consider breaking long text into multiple fields

### Barcode not showing
- Check logs for barcode generation errors
- Barcode is automatically centered at top (no config needed)
- Verify the barcode value is being generated correctly

