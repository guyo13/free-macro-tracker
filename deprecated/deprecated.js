function FMTCreateUnitDropdownMenu(baseName, targetDiv, unitsChart, defaultUnitName, readonly, suffix, unitFilerFn) {
    const _fnName = "FMTCreateUnitDropdownMenu";
    //let tDiv = document.getElementById(targetDivId);
    if (!!targetDiv) {
        let inputGroupId = `${baseName}-fmtigroup${!!suffix ? `-${suffix}`: ""}`;
        let inputGroup = document.getElementById(inputGroupId);
        if (!!inputGroup) {
            inputGroup.parentElement.removeChild(inputGroup);
        }
        //Input group container Div for Units
        inputGroup = document.createElement("div");
        inputGroup.classList.add("col-3", "col-lg-1", "pl-0", "input-group-append", "fmt-unit-igroup");
        inputGroup.setAttribute("id", inputGroupId);
        //Button element that holds the 'unit' attribute and the unit text
        let selectedBtn = document.createElement("button");
        let selectedBtnId = `${baseName}-units${!!suffix ? `-${suffix}`: ""}`;
        selectedBtn.classList.add("btn", "btn-outline-dark", "fmt-outline-success");
        selectedBtn.setAttribute("type", "button");
        selectedBtn.setAttribute("id", selectedBtnId);
        inputGroup.appendChild(selectedBtn);

        //
        if (!readonly) {
            //Dropdown caret button
            let ddBtn = document.createElement("div");
            ddBtn.classList.add("btn", "btn-outline-dark", "dropdown-toggle", "dropdown-toggle-split", "fmt-outline-success");
            ddBtn.setAttribute("type", "button");
            ddBtn.setAttribute("data-toggle", "dropdown");
            ddBtn.setAttribute("aria-haspopup", "true");
            ddBtn.setAttribute("aria-expanded", "false");
            let span = document.createElement("span");
            span.classList.add("sr-only");
            span.innerHTML = "Toggle Dropdown";
            ddBtn.appendChild(span);
            inputGroup.appendChild(ddBtn);
            //Dropdown Menu
            let ddMenu = document.createElement("div");
            let ddMenuId = `${baseName}-units-dropdown${!!suffix ? `-${suffix}`: ""}`;
            ddMenu.classList.add("dropdown-menu");
            ddMenu.setAttribute("id", ddMenuId);

            //Populate dropdown menu. TODO - Add function...
            let unitNames = Object.keys(unitsChart);
            if (isFunction(unitFilerFn)) {
              unitNames = unitNames.filter(unitFilerFn);
            }
            for (let j=0; j<unitNames.length; j++) {
                let unitName = unitNames[j];
                let unit = unitsChart[unitName];
                if (!unit) {
                  console.warn(`[${_fnName}] - ${unitName} couldn't be found in units chart`);
                  continue;
                }
                let normUnitName = unitName.replace(/ /g, "_");
                let mUnitId = `${baseName}-unit-${normUnitName}${!!suffix ? `-${suffix}`: ""}`;
                let ddItem = document.createElement("a");
                ddItem.classList.add("dropdown-item");
                ddItem.setAttribute("href", `#${ddMenuId}`);
                ddItem.setAttribute("id", mUnitId);
                ddItem.innerHTML = unit.description;
                ddItem.addEventListener("click", function(e) {
                    FMTDropdownToggleValue(selectedBtnId, unitName, {"unit": unitName});
                });
                ddMenu.appendChild(ddItem);
            }
            //Append finished dropdown menu to container div
            inputGroup.appendChild(ddMenu);
        }
        targetDiv.appendChild(inputGroup);
        if (!!defaultUnitName && (defaultUnitName) in unitsChart) {
            _FMTDropdownToggleValue(selectedBtn, defaultUnitName, {"unit": defaultUnitName});
        }
    }
    else {
        console.warn(`[${_fnName}] - Requested dropdown menu creation with base name ${baseName} in inexisting target Div ID ${targetDivId}`);
    }
}
