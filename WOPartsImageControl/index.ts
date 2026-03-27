import { IInputs, IOutputs } from "./generated/ManifestTypes";

// ─── Types ──────────────────────────────────────────────────────────────────
type ControlState = "capture" | "analyzing" | "results" | "create" | "confirm" | "error";

interface PartIdentification {
    partType: string;
    manufacturer: string;
    modelNumber: string;
    description: string;
}

interface ProductMatch {
    productId: string;
    name: string;
    productNumber: string;
    description: string;
    unitId: string;
}

// ─── Inline Styles ──────────────────────────────────────────────────────────
const INLINE_STYLES = `
@keyframes wpi-spin { to { transform: rotate(360deg); } }
@keyframes wpi-fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

.wpi-root {
  font-family: -apple-system, "SF Pro Display", "Segoe UI", system-ui, sans-serif;
  max-width: 420px;
  animation: wpi-fade-in .3s ease;
}

/* ── Capture state ── */
.wpi-capture-area {
  border: 2px dashed #c7c7cc;
  border-radius: 16px;
  padding: 32px 24px;
  text-align: center;
  background: #fafafa;
  transition: border-color .2s, background .2s;
}
.wpi-capture-area:hover {
  border-color: #0078d4;
  background: #f0f6ff;
}
.wpi-capture-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 28px;
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  background: #0078d4;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: background .2s, transform .1s;
  min-height: 48px;
}
.wpi-capture-btn:hover { background: #106ebe; }
.wpi-capture-btn:active { transform: scale(.97); }
.wpi-capture-hint {
  margin-top: 10px;
  font-size: 12px;
  color: #8e8e93;
}
.wpi-file-input { display: none; }

/* ── Analyzing state ── */
.wpi-analyzing {
  text-align: center;
  padding: 24px;
}
.wpi-spinner {
  width: 36px; height: 36px;
  border: 3px solid #e5e5ea;
  border-top-color: #0078d4;
  border-radius: 50%;
  animation: wpi-spin .8s linear infinite;
  margin: 0 auto 16px;
}
.wpi-preview {
  max-width: 200px;
  max-height: 150px;
  border-radius: 10px;
  margin-bottom: 16px;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0,0,0,.1);
}
.wpi-analyzing-text {
  font-size: 14px;
  color: #3a3a3c;
  font-weight: 500;
}

/* ── Results state ── */
.wpi-results-header {
  font-size: 13px;
  font-weight: 600;
  color: #3a3a3c;
  margin-bottom: 6px;
}
.wpi-ai-info {
  background: #f0f6ff;
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 14px;
  font-size: 12px;
  color: #3a3a3c;
  line-height: 1.5;
  border: 1px solid #d0e2f7;
}
.wpi-ai-label {
  font-weight: 600;
  color: #0078d4;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: .5px;
  margin-bottom: 4px;
}
.wpi-match-list {
  list-style: none;
  padding: 0;
  margin: 0 0 14px;
}
.wpi-match-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border: 2px solid #e5e5ea;
  border-radius: 10px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: border-color .2s, background .2s;
  min-height: 48px;
}
.wpi-match-item:hover { border-color: #0078d4; background: #f8fbff; }
.wpi-match-item.selected { border-color: #0078d4; background: #edf5ff; }
.wpi-match-radio {
  width: 20px; height: 20px;
  border: 2px solid #c7c7cc;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: border-color .2s;
}
.wpi-match-item.selected .wpi-match-radio {
  border-color: #0078d4;
}
.wpi-match-radio-dot {
  width: 10px; height: 10px;
  border-radius: 50%;
  background: #0078d4;
  display: none;
}
.wpi-match-item.selected .wpi-match-radio-dot { display: block; }
.wpi-match-details { flex: 1; min-width: 0; }
.wpi-match-name {
  font-size: 13px;
  font-weight: 600;
  color: #1d1d1f;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.wpi-match-number {
  font-size: 11px;
  color: #8e8e93;
  margin-top: 2px;
}
.wpi-no-match {
  text-align: center;
  padding: 20px;
  color: #8e8e93;
  font-size: 13px;
  background: #f9f9f9;
  border-radius: 10px;
  margin-bottom: 14px;
}

/* ── Action buttons ── */
.wpi-actions {
  display: flex;
  gap: 10px;
}
.wpi-btn-primary {
  flex: 1;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background: #0078d4;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  min-height: 44px;
  transition: background .2s, opacity .2s;
}
.wpi-btn-primary:hover { background: #106ebe; }
.wpi-btn-primary:disabled { opacity: .5; cursor: not-allowed; }
.wpi-btn-secondary {
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 500;
  color: #0078d4;
  background: #f0f6ff;
  border: 1px solid #d0e2f7;
  border-radius: 10px;
  cursor: pointer;
  min-height: 44px;
  transition: background .2s;
}
.wpi-btn-secondary:hover { background: #e0edfa; }

/* ── Confirm state ── */
.wpi-confirm {
  text-align: center;
  padding: 24px;
}
.wpi-confirm-icon {
  font-size: 40px;
  margin-bottom: 10px;
}
.wpi-confirm-text {
  font-size: 15px;
  font-weight: 600;
  color: #248a3d;
  margin-bottom: 4px;
}
.wpi-confirm-detail {
  font-size: 12px;
  color: #8e8e93;
  margin-bottom: 16px;
}

/* ── Error state ── */
.wpi-error {
  text-align: center;
  padding: 24px;
}
.wpi-error-icon {
  font-size: 40px;
  margin-bottom: 10px;
}
.wpi-error-text {
  font-size: 14px;
  color: #c0392b;
  font-weight: 500;
  margin-bottom: 4px;
}
.wpi-error-detail {
  font-size: 12px;
  color: #8e8e93;
  margin-bottom: 16px;
  word-break: break-word;
}

/* ── Create product form ── */
.wpi-create-header {
  font-size: 14px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 14px;
}
.wpi-form-group {
  margin-bottom: 12px;
}
.wpi-form-label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: #8e8e93;
  text-transform: uppercase;
  letter-spacing: .5px;
  margin-bottom: 4px;
}
.wpi-form-input {
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  border: 1.5px solid #d1d1d6;
  border-radius: 8px;
  background: #fff;
  color: #1d1d1f;
  font-family: inherit;
  transition: border-color .2s;
  box-sizing: border-box;
}
.wpi-form-input:focus {
  outline: none;
  border-color: #0078d4;
  box-shadow: 0 0 0 3px rgba(0,120,212,.12);
}
`;

// ─── Control Implementation ─────────────────────────────────────────────────
export class WOPartsImageControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _container!: HTMLDivElement;
    private _context!: ComponentFramework.Context<IInputs>;
    private _styleInjected = false;

    // State
    private _state: ControlState = "capture";
    private _imageBase64: string | null = null;
    private _identification: PartIdentification | null = null;
    private _matches: ProductMatch[] = [];
    private _selectedIndex = -1;
    private _errorMessage = "";
    private _addedProductName = "";

    public init(
        context: ComponentFramework.Context<IInputs>,
        _notifyOutputChanged: () => void,
        _state: ComponentFramework.Dictionary,
        container: HTMLDivElement
    ): void {
        this._container = container;
        this._context = context;
        this.injectStyles();
        this.render();
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        this._context = context;
    }

    public getOutputs(): IOutputs { return {}; }
    public destroy(): void { /* no-op */ }

    // ─── Entity ID Resolution (4-level fallback from PCF 01) ────────────────

    private resolveEntityId(): string | undefined {
        const mode = this._context.mode as unknown as Record<string, unknown>;

        const fromMode = mode["entityId"] as string | undefined;
        if (fromMode) return fromMode.replace(/[{}]/g, "");

        const ci = mode["contextInfo"] as Record<string, unknown> | undefined;
        const fromCi = ci?.["entityId"] as string | undefined;
        if (fromCi) return fromCi.replace(/[{}]/g, "");

        try {
            for (const w of [window, window.parent, window.top] as Window[]) {
                const id = new URLSearchParams(w?.location?.search ?? "").get("id");
                if (id) return id.replace(/[{}]/g, "");
            }
        } catch { /* cross-origin guard */ }

        try {
            for (const w of [window, window.parent, window.top]) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const xrm = (w as any)?.Xrm;
                if (!xrm) continue;
                const id: string | undefined =
                    xrm?.Page?.data?.entity?.getId?.() ??
                    xrm?.Utility?.getEntityReference?.()?.id;
                if (id) return id.replace(/[{}]/g, "");
            }
        } catch { /* ignore */ }

        return undefined;
    }

    // ─── Render (state machine) ─────────────────────────────────────────────

    private render(): void {
        this._container.innerHTML = "";
        const root = document.createElement("div");
        root.className = "wpi-root";

        switch (this._state) {
            case "capture":    this.renderCapture(root); break;
            case "analyzing":  this.renderAnalyzing(root); break;
            case "results":    this.renderResults(root); break;
            case "create":     this.renderCreateProduct(root); break;
            case "confirm":    this.renderConfirm(root); break;
            case "error":      this.renderError(root); break;
        }

        this._container.appendChild(root);
    }

    // ── Capture ──

    private renderCapture(root: HTMLDivElement): void {
        const area = document.createElement("div");
        area.className = "wpi-capture-area";

        const fileInput = document.createElement("input");
        fileInput.type = "file";
        fileInput.accept = "image/*";
        fileInput.setAttribute("capture", "environment");
        fileInput.className = "wpi-file-input";
        fileInput.addEventListener("change", () => this.handleFileSelected(fileInput));

        const btn = document.createElement("button");
        btn.className = "wpi-capture-btn";
        btn.innerHTML = "&#128247;&ensp;Take Photo";
        btn.addEventListener("click", () => fileInput.click());

        const hint = document.createElement("div");
        hint.className = "wpi-capture-hint";
        hint.textContent = "Take a photo of the part to identify it";

        area.appendChild(fileInput);
        area.appendChild(btn);
        area.appendChild(hint);
        root.appendChild(area);
    }

    private handleFileSelected(input: HTMLInputElement): void {
        const file = input.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result as string;
            this._imageBase64 = dataUrl;
            this._state = "analyzing";
            this.render();
            this.identifyPart(dataUrl);
        };
        reader.readAsDataURL(file);
    }

    // ── Analyzing ──

    private renderAnalyzing(root: HTMLDivElement): void {
        const wrap = document.createElement("div");
        wrap.className = "wpi-analyzing";

        if (this._imageBase64) {
            const img = document.createElement("img");
            img.className = "wpi-preview";
            img.src = this._imageBase64;
            wrap.appendChild(img);
        }

        const spinner = document.createElement("div");
        spinner.className = "wpi-spinner";
        wrap.appendChild(spinner);

        const text = document.createElement("div");
        text.className = "wpi-analyzing-text";
        text.textContent = "Identifying part...";
        wrap.appendChild(text);

        root.appendChild(wrap);
    }

    // ── Results ──

    private renderResults(root: HTMLDivElement): void {
        // AI identification summary
        if (this._identification) {
            const aiBox = document.createElement("div");
            aiBox.className = "wpi-ai-info";

            const label = document.createElement("div");
            label.className = "wpi-ai-label";
            label.textContent = "AI Identification";
            aiBox.appendChild(label);

            const lines = [
                this._identification.partType,
                this._identification.manufacturer ? `Manufacturer: ${this._identification.manufacturer}` : "",
                this._identification.modelNumber ? `Model/Part #: ${this._identification.modelNumber}` : "",
                this._identification.description
            ].filter(Boolean);

            for (const line of lines) {
                const div = document.createElement("div");
                div.textContent = line;
                aiBox.appendChild(div);
            }
            root.appendChild(aiBox);
        }

        // Matches
        if (this._matches.length > 0) {
            const header = document.createElement("div");
            header.className = "wpi-results-header";
            header.textContent = `${this._matches.length} product${this._matches.length > 1 ? "s" : ""} found in catalog`;
            root.appendChild(header);

            const list = document.createElement("ul");
            list.className = "wpi-match-list";

            this._matches.forEach((match, idx) => {
                const li = document.createElement("li");
                li.className = `wpi-match-item${idx === this._selectedIndex ? " selected" : ""}`;
                li.addEventListener("click", () => {
                    this._selectedIndex = idx;
                    this.render();
                });

                const radio = document.createElement("div");
                radio.className = "wpi-match-radio";
                const dot = document.createElement("div");
                dot.className = "wpi-match-radio-dot";
                radio.appendChild(dot);
                li.appendChild(radio);

                const details = document.createElement("div");
                details.className = "wpi-match-details";
                const nameEl = document.createElement("div");
                nameEl.className = "wpi-match-name";
                nameEl.textContent = match.name;
                details.appendChild(nameEl);
                if (match.productNumber) {
                    const numEl = document.createElement("div");
                    numEl.className = "wpi-match-number";
                    numEl.textContent = match.productNumber;
                    details.appendChild(numEl);
                }
                li.appendChild(details);
                list.appendChild(li);
            });

            root.appendChild(list);
        } else {
            const noMatch = document.createElement("div");
            noMatch.className = "wpi-no-match";
            noMatch.textContent = "No matching products found in the catalog";
            root.appendChild(noMatch);
        }

        // Action buttons
        const actions = document.createElement("div");
        actions.className = "wpi-actions";

        const retakeBtn = document.createElement("button");
        retakeBtn.className = "wpi-btn-secondary";
        retakeBtn.textContent = "Retake";
        retakeBtn.addEventListener("click", () => this.resetToCapture());
        actions.appendChild(retakeBtn);

        if (this._matches.length > 0) {
            const addBtn = document.createElement("button");
            addBtn.className = "wpi-btn-primary";
            addBtn.textContent = "Add to Work Order";
            addBtn.disabled = this._selectedIndex < 0;
            addBtn.addEventListener("click", () => this.addSelectedProduct());
            actions.appendChild(addBtn);
        }

        const createBtn = document.createElement("button");
        createBtn.className = this._matches.length > 0 ? "wpi-btn-secondary" : "wpi-btn-primary";
        createBtn.textContent = "Create New";
        createBtn.addEventListener("click", () => {
            this._state = "create";
            this.render();
        });
        actions.appendChild(createBtn);

        root.appendChild(actions);
    }

    // ── Confirm ──

    private renderConfirm(root: HTMLDivElement): void {
        const wrap = document.createElement("div");
        wrap.className = "wpi-confirm";

        const icon = document.createElement("div");
        icon.className = "wpi-confirm-icon";
        icon.textContent = "\u2705";
        wrap.appendChild(icon);

        const text = document.createElement("div");
        text.className = "wpi-confirm-text";
        text.textContent = "Part Added to Work Order";
        wrap.appendChild(text);

        const detail = document.createElement("div");
        detail.className = "wpi-confirm-detail";
        detail.textContent = this._addedProductName;
        wrap.appendChild(detail);

        const btn = document.createElement("button");
        btn.className = "wpi-btn-primary";
        btn.textContent = "Add Another Part";
        btn.addEventListener("click", () => this.resetToCapture());
        wrap.appendChild(btn);

        root.appendChild(wrap);
    }

    // ── Error ──

    private renderError(root: HTMLDivElement): void {
        const wrap = document.createElement("div");
        wrap.className = "wpi-error";

        const icon = document.createElement("div");
        icon.className = "wpi-error-icon";
        icon.textContent = "\u26A0\uFE0F";
        wrap.appendChild(icon);

        const text = document.createElement("div");
        text.className = "wpi-error-text";
        text.textContent = "Something went wrong";
        wrap.appendChild(text);

        const detail = document.createElement("div");
        detail.className = "wpi-error-detail";
        detail.textContent = this._errorMessage;
        wrap.appendChild(detail);

        const btn = document.createElement("button");
        btn.className = "wpi-btn-secondary";
        btn.textContent = "Try Again";
        btn.addEventListener("click", () => this.resetToCapture());
        wrap.appendChild(btn);

        root.appendChild(wrap);
    }

    // ─── AI Service ─────────────────────────────────────────────────────────

    private async identifyPart(dataUrl: string): Promise<void> {
        try {
            const apiKey = this._context.parameters.apiKey?.raw ?? "";
            if (!apiKey) {
                this.showError("No API key configured. Set the Claude API Key property on the control.");
                return;
            }

            // Strip data URL prefix to get raw base64
            const base64 = dataUrl.replace(/^data:image\/\w+;base64,/, "");
            const mediaType = dataUrl.match(/^data:(image\/\w+);/)?.[1] ?? "image/jpeg";

            const response = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": apiKey,
                    "anthropic-version": "2023-06-01",
                    "anthropic-dangerous-direct-browser-access": "true"
                },
                body: JSON.stringify({
                    model: "claude-sonnet-4-20250514",
                    max_tokens: 300,
                    messages: [{
                        role: "user",
                        content: [
                            {
                                type: "image",
                                source: { type: "base64", media_type: mediaType, data: base64 }
                            },
                            {
                                type: "text",
                                text: `You are identifying a mechanical, electrical, or industrial part from this photo.
Respond ONLY with a JSON object (no markdown, no code fences):
{
  "partType": "general type of part (e.g. Circuit Breaker, Contactor, Filter)",
  "manufacturer": "manufacturer name if visible, empty string if not",
  "modelNumber": "model or part number if visible, empty string if not",
  "description": "brief description of what you see"
}
If you cannot identify the part, still return the JSON with your best guess for partType and description.`
                            }
                        ]
                    }]
                })
            });

            if (!response.ok) {
                const errBody = await response.text();
                this.showError(`Claude API error (${response.status}): ${errBody.substring(0, 200)}`);
                return;
            }

            const result = await response.json();
            const text: string = result.content?.[0]?.text ?? "";

            // Parse JSON from response (handle possible markdown fences)
            const jsonStr = text.replace(/```json?\s*/g, "").replace(/```/g, "").trim();
            const identification: PartIdentification = JSON.parse(jsonStr);
            this._identification = identification;

            // Search for matching products
            await this.searchProducts(identification);

            this._state = "results";
            // Auto-select if only one match
            if (this._matches.length === 1) this._selectedIndex = 0;
            this.render();

        } catch (err: unknown) {
            this.showError(`Identification failed: ${this.formatError(err)}`);
        }
    }

    // ─── Product Search ─────────────────────────────────────────────────────

    private async searchProducts(id: PartIdentification): Promise<void> {
        // Build search terms from the AI identification
        const terms: string[] = [];
        if (id.modelNumber) terms.push(id.modelNumber);
        if (id.manufacturer) terms.push(id.manufacturer);
        if (id.partType) terms.push(id.partType);

        const allMatches = new Map<string, ProductMatch>();

        // Search each term separately, combine results
        for (const term of terms) {
            if (!term) continue;
            const cleanTerm = term.replace(/'/g, "''"); // escape single quotes for OData
            const filter =
                `statecode eq 0 and (` +
                `contains(name,'${cleanTerm}') or ` +
                `contains(productnumber,'${cleanTerm}') or ` +
                `contains(description,'${cleanTerm}')` +
                `)`;
            try {
                const result = await this._context.webAPI.retrieveMultipleRecords(
                    "product",
                    `?$filter=${filter}` +
                    `&$select=productid,name,productnumber,description,_defaultuomid_value` +
                    `&$top=5`
                );
                for (const e of result.entities) {
                    const pid = e["productid"] as string;
                    if (!allMatches.has(pid)) {
                        allMatches.set(pid, {
                            productId: pid,
                            name: (e["name"] as string) || "",
                            productNumber: (e["productnumber"] as string) || "",
                            description: (e["description"] as string) || "",
                            unitId: (e["_defaultuomid_value"] as string) || ""
                        });
                    }
                }
            } catch {
                // Continue searching with other terms if one fails
            }
        }

        this._matches = Array.from(allMatches.values()).slice(0, 10);
    }

    // ─── Create Work Order Product ──────────────────────────────────────────

    private async addSelectedProduct(): Promise<void> {
        if (this._selectedIndex < 0 || this._selectedIndex >= this._matches.length) return;

        const match = this._matches[this._selectedIndex];
        const workOrderId = this.resolveEntityId();

        if (!workOrderId) {
            this.showError("Cannot determine Work Order ID. Open this control from a Work Order form.");
            return;
        }

        // Show analyzing state while creating
        this._state = "analyzing";
        this.render();
        const analyzingText = this._container.querySelector(".wpi-analyzing-text");
        if (analyzingText) analyzingText.textContent = "Adding part to work order...";

        try {
            // Build the Work Order Product record
            const woProduct: Record<string, unknown> = {
                "msdyn_workorder@odata.bind": `/msdyn_workorders(${workOrderId})`,
                "msdyn_product@odata.bind": `/products(${match.productId})`,
                "msdyn_quantity": 1,
                "msdyn_linestatus": 690970000, // Estimated
            };

            // Add unit of measure if available
            if (match.unitId) {
                woProduct["msdyn_unit@odata.bind"] = `/uoms(${match.unitId})`;
            }

            // Add AI description as a note
            if (this._identification) {
                const desc = [
                    this._identification.partType,
                    this._identification.manufacturer ? `Mfg: ${this._identification.manufacturer}` : "",
                    this._identification.modelNumber ? `Part#: ${this._identification.modelNumber}` : ""
                ].filter(Boolean).join(" | ");
                woProduct["msdyn_description"] = `[AI Identified] ${desc}`;
            }

            await this._context.webAPI.createRecord("msdyn_workorderproduct", woProduct);

            this._addedProductName = match.name;
            this._state = "confirm";
            this.render();

        } catch (err: unknown) {
            this.showError(`Failed to add product: ${this.formatError(err)}`);
        }
    }

    // ─── Create Product Flow ────────────────────────────────────────────────

    private renderCreateProduct(root: HTMLDivElement): void {
        const id = this._identification;

        // AI summary at top
        if (id) {
            const aiBox = document.createElement("div");
            aiBox.className = "wpi-ai-info";
            const label = document.createElement("div");
            label.className = "wpi-ai-label";
            label.textContent = "Creating from AI Identification";
            aiBox.appendChild(label);
            root.appendChild(aiBox);
        }

        const header = document.createElement("div");
        header.className = "wpi-create-header";
        header.textContent = "New Product Details";
        root.appendChild(header);

        // Product Name
        const nameGroup = document.createElement("div");
        nameGroup.className = "wpi-form-group";
        const nameLabel = document.createElement("label");
        nameLabel.className = "wpi-form-label";
        nameLabel.textContent = "Product Name";
        const nameInput = document.createElement("input");
        nameInput.className = "wpi-form-input";
        nameInput.id = "wpi-create-name";
        nameInput.value = id ? [id.manufacturer, id.partType].filter(Boolean).join(" ") : "";
        nameGroup.appendChild(nameLabel);
        nameGroup.appendChild(nameInput);
        root.appendChild(nameGroup);

        // Product Number
        const numGroup = document.createElement("div");
        numGroup.className = "wpi-form-group";
        const numLabel = document.createElement("label");
        numLabel.className = "wpi-form-label";
        numLabel.textContent = "Product Number";
        const numInput = document.createElement("input");
        numInput.className = "wpi-form-input";
        numInput.id = "wpi-create-number";
        numInput.value = id?.modelNumber ?? "";
        numGroup.appendChild(numLabel);
        numGroup.appendChild(numInput);
        root.appendChild(numGroup);

        // Description
        const descGroup = document.createElement("div");
        descGroup.className = "wpi-form-group";
        const descLabel = document.createElement("label");
        descLabel.className = "wpi-form-label";
        descLabel.textContent = "Description";
        const descInput = document.createElement("input");
        descInput.className = "wpi-form-input";
        descInput.id = "wpi-create-desc";
        descInput.value = id?.description ?? "";
        descGroup.appendChild(descLabel);
        descGroup.appendChild(descInput);
        root.appendChild(descGroup);

        // Action buttons
        const actions = document.createElement("div");
        actions.className = "wpi-actions";

        const cancelBtn = document.createElement("button");
        cancelBtn.className = "wpi-btn-secondary";
        cancelBtn.textContent = "Cancel";
        cancelBtn.addEventListener("click", () => {
            this._state = "results";
            this.render();
        });
        actions.appendChild(cancelBtn);

        const createBtn = document.createElement("button");
        createBtn.className = "wpi-btn-primary";
        createBtn.textContent = "Create & Add to WO";
        createBtn.addEventListener("click", () => {
            const name = (this._container.querySelector("#wpi-create-name") as HTMLInputElement)?.value?.trim();
            const number = (this._container.querySelector("#wpi-create-number") as HTMLInputElement)?.value?.trim();
            const desc = (this._container.querySelector("#wpi-create-desc") as HTMLInputElement)?.value?.trim();
            if (!name) {
                nameInput.style.borderColor = "#FF3B30";
                return;
            }
            this.createProductAndAdd(name, number, desc);
        });
        actions.appendChild(createBtn);

        root.appendChild(actions);
    }

    private async createProductAndAdd(name: string, productNumber: string, description: string): Promise<void> {
        const workOrderId = this.resolveEntityId();
        if (!workOrderId) {
            this.showError("Cannot determine Work Order ID. Open this control from a Work Order form.");
            return;
        }

        this._state = "analyzing";
        this.render();
        const setStatus = (msg: string) => {
            const el = this._container.querySelector(".wpi-analyzing-text");
            if (el) el.textContent = msg;
        };
        setStatus("Creating product...");

        try {
            // Step 1: Get default UoM and its schedule
            const uomResult = await this._context.webAPI.retrieveMultipleRecords(
                "uom",
                "?$select=uomid,name,_uomscheduleid_value&$top=1"
            );
            const defaultUomId = uomResult.entities[0]?.["uomid"] as string | undefined;
            const scheduleId = uomResult.entities[0]?.["_uomscheduleid_value"] as string | undefined;

            // Step 2: Get default price list
            const priceListResult = await this._context.webAPI.retrieveMultipleRecords(
                "pricelevel",
                "?$select=pricelevelid,name&$filter=statecode eq 0&$top=1"
            );
            const priceListId = priceListResult.entities[0]?.["pricelevelid"] as string | undefined;

            // Step 3: Create the product
            const productRecord: Record<string, unknown> = {
                "name": name,
                "productnumber": productNumber || `AI-${Date.now()}`,
                "description": description,
                "producttypecode": 1, // Sales Inventory
                "quantitydecimal": 2,
                "msdyn_fieldserviceproducttype": 690970000, // Inventory
            };
            if (defaultUomId) {
                productRecord["defaultuomid@odata.bind"] = `/uoms(${defaultUomId})`;
            }
            if (scheduleId) {
                productRecord["defaultuomscheduleid@odata.bind"] = `/uomschedules(${scheduleId})`;
            }

            const createdProduct = await this._context.webAPI.createRecord("product", productRecord);
            const newProductId = createdProduct.id.replace(/[{}]/g, "");

            // Step 4: Add to price list (create price list item)
            if (priceListId && defaultUomId) {
                setStatus("Adding to price list...");
                const priceListItem: Record<string, unknown> = {
                    "pricelevelid@odata.bind": `/pricelevels(${priceListId})`,
                    "productid@odata.bind": `/products(${newProductId})`,
                    "uomid@odata.bind": `/uoms(${defaultUomId})`,
                    "amount": 0, // Default price, can be updated later
                    "pricingmethodcode": 1, // Currency Amount
                };
                await this._context.webAPI.createRecord("productpricelevel", priceListItem);
            }

            // Step 5: Create Work Order Product line item
            setStatus("Adding to work order...");
            const woProduct: Record<string, unknown> = {
                "msdyn_workorder@odata.bind": `/msdyn_workorders(${workOrderId})`,
                "msdyn_product@odata.bind": `/products(${newProductId})`,
                "msdyn_quantity": 1,
                "msdyn_linestatus": 690970000, // Estimated
            };
            if (defaultUomId) {
                woProduct["msdyn_unit@odata.bind"] = `/uoms(${defaultUomId})`;
            }
            if (this._identification) {
                woProduct["msdyn_description"] = `[AI Created] ${description}`;
            }

            await this._context.webAPI.createRecord("msdyn_workorderproduct", woProduct);

            this._addedProductName = `${name} (new product created)`;
            this._state = "confirm";
            this.render();

        } catch (err: unknown) {
            this.showError(`Failed to create product: ${this.formatError(err)}`);
        }
    }

    // ─── Helpers ────────────────────────────────────────────────────────────

    private resetToCapture(): void {
        this._state = "capture";
        this._imageBase64 = null;
        this._identification = null;
        this._matches = [];
        this._selectedIndex = -1;
        this._errorMessage = "";
        this._addedProductName = "";
        this.render();
    }

    private formatError(err: unknown): string {
        if (err instanceof Error) return err.message;
        if (typeof err === "object" && err !== null) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const e = err as any;
            return e.message || e.errorMessage || e.detail || JSON.stringify(err).substring(0, 300);
        }
        return String(err);
    }

    private showError(msg: string): void {
        this._errorMessage = msg;
        this._state = "error";
        this.render();
    }

    private injectStyles(): void {
        if (this._styleInjected) return;
        const s = document.createElement("style");
        s.textContent = INLINE_STYLES;
        document.head.appendChild(s);
        this._styleInjected = true;
    }
}
