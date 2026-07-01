import React, { useState, useEffect, FunctionComponent } from "react";
import { TreeSelect, Select, Button, Popover, Spin, DatePicker } from "antd";
import { observer } from "mobx-react";
import { useStore } from "../Context";
import moment, { Moment } from "moment";
import { getQueryParams , nationalitiesComboOptions } from "../utils/extra";

const { Option } = Select;

// const categoryOptionCombos = [
//   {
//     name: "1. National",
//     id: "l4UMmqvSBe5",
//   },
//   {
//     name: "2. Foreigner",
//     id: "VJU0bY182ND",
//   },
//   {
//     name: "3. Refugee",
//     id: "wUteK0Om3qP",
//   },
// ];

interface OrgUnitTreeTypes {
   loading?: boolean;
   fetching?: boolean;
}

const { RangePicker } = DatePicker;

const defaultRange: any = [moment().subtract(2, "months"), moment(), moment().subtract(4, "months")];

export const OrgUnitTree: FunctionComponent<OrgUnitTreeTypes> = observer(({ loading, fetching }) => {
   const [categoryOptionCombos, setCategoryOptionCombos] = useState([]);
   const [userIsAuthorized, setUserIsAuthorized] = useState(false);
   const [units, setUnits] = useState([]);
   const store = useStore();
   const [showWarn, setShowWarn] = useState(false);
   const [showLangWarn, setShowLangWarn] = useState(false);
   const [showApiWarn, setShowApiWarn] = useState(false);
   const activeLanguage = store.activeLanguage;

   const onLoadData = async (treeNode: any) => {
      await store.loadOrganisationUnitsChildren(treeNode.id);
      setUnits(store.organisationUnits);
      console.log("otddddd", store.organisationUnits);
   };

   useEffect(() => {
      store.selectedDateRange = [
         defaultRange[0].format("YYYY-MM-DD"),
         defaultRange[1].format("YYYY-MM-DD"),
         defaultRange[2].format("YYYY-MM-DD"),
      ];

      if (store.nationalitySelect?.length) {
         console.log("categoryOptionCombos", store.nationalitySelect);
         setCategoryOptionCombos(store.nationalitySelect);
      }
   }, [store.nationalitySelect]);

   useEffect(() => {
      if (store.userOrgUnits?.length) {
         setUnits(store.organisationUnits);
      }
   }, [store, fetching]);

   const checkIfLangWarnApplies = async () => {
      if (!userIsAuthorized) {
         setShowLangWarn(true);
      }
   };

   const handleLangWarnClose = () => setShowLangWarn(false);

   const checkIfApiWarnApplies = async () => {
      if (!userIsAuthorized) {
         setShowApiWarn(true);
      }
   };

   const handleApiWarnClose = () => setShowApiWarn(false);

   const checkIfWarnApplies = () => {
      if (store.selectedOrgUnit && store.selectedNationality && !store.currentOrganisation) {
         setShowWarn(true);
      }
   };

   const handleSelect = (ranges) => {
      if (!ranges) {
         store.clearSelectedDateRange();
      } else {
         const startDate = ranges[0].format("YYYY-MM-DD");
         const endDate = ranges[1].format("YYYY-MM-DD");
         const duration = ranges[1].diff(ranges[0], "days");

         const prevDate = ranges[0].subtract(duration, "days").format("YYYY-MM-DD");

         store.changeSelectedDateRange(startDate, endDate, prevDate);
      }
   };

   const handleWarnClose = () => setShowWarn(false);

   const showLangConfig = () => store.showLang();

   const checkApproval = async () => {
      const isAuthorized = await store.checkIfAdmin();
      setUserIsAuthorized(isAuthorized);
   };

   useEffect(() => {

      //TODO If you have a query param called edit set

      const params = getQueryParams();
      if(params['iframe_edit'] != undefined && params['iframe_edit'] == 'true'){
         store.setIsIframeEdit(true);
         localStorage.setItem("mcodtemp", JSON.stringify(params));
         //Use nationlaity param to select the nationality
         const nationalitySting =  params.nationality ?? "1. National"
         const nationality = nationalitiesComboOptions.find(nationality   =>  nationality.name ==  nationalitySting.trim())
         store.setSelectedNationality(nationality.id)
      }

      const mcodtemp = localStorage.getItem("mcodtemp");
      console.log("checking ls", mcodtemp);
      if (!!mcodtemp) {
         store.setNewFromLocalStorage(JSON.parse(mcodtemp));
      }
      checkApproval();
   }, []);

   return (
      <Spin spinning={loading}>
         <div className="flex" style={{ alignItems: "flex-start" }}>
            <div className="w-5/12 pr-1">
               <TreeSelect
                  showSearch
                  allowClear={true}
                  treeDataSimpleMode
                  size="large"
                  style={{ width: "100%" }}
                  treeNodeFilterProp="title"
                  disabled={!!store.selectedLevel}
                  value={store.selectedOrgUnit}
                  dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                  placeholder={activeLanguage?.lang["Please select health centre"]}
                  onChange={store.setSelectedOrgUnit}
                  //loadData={onLoadData}
                  treeData={units}
               />
            </div>
            <div className="w-5/12 pl-1">
               <Select
                  style={{ width: "100%" }}
                  allowClear={true}
                  placeholder={activeLanguage?.lang["Nationality"]}
                  onChange={store.setSelectedNationality}
                  disabled={store.isIframeEdit}
                  size="large"
                  value={store.selectedNationality}
               >
                  {categoryOptionCombos.map((p: any) => (
                     <Option value={p.id} key={p.id}>
                        {p.name}
                     </Option>
                  ))}
               </Select>
            </div>
            <Popover
               placement="bottomRight"
               title="Organisation Units Missing"
               content="Please contact your administrator to assign the form to the organisation unit you selected."
               visible={showWarn}
            >
               <div className="w-2/12 p-2 text-right" onMouseEnter={checkIfWarnApplies} onMouseLeave={handleWarnClose}>
                  <Button
                     size="large"
                     onClick={store.viewMode ? store.editEvent : store.showForm}
                     disabled={!store.canInsert || store.forceDisable}
                  >
                     {store.viewMode ? activeLanguage?.lang["Edit Event"] : activeLanguage?.lang["Add Event"]}
                  </Button>
               </div>
            </Popover>

            <Popover
               placement="bottomRight"
               title="Insufficient Permissions"
               content="Please contact your administrator to change the api settings for you."
               visible={showApiWarn}
            >
               <div
                  className="w-2/12 p-2 text-right"
                  onMouseEnter={checkIfApiWarnApplies}
                  onMouseLeave={handleApiWarnClose}
               >
                  <Button size="large" onClick={store.showApi} disabled={!userIsAuthorized}>
                     {activeLanguage?.lang["API"] ?? "API"}
                  </Button>
               </div>
            </Popover>

            <Popover
               placement="bottomRight"
               title="Insufficient Permissions"
               content="Please contact your administrator to change the active language for you."
               visible={showLangWarn}
            >
               <div
                  className="w-2/12 p-2 text-right"
                  onMouseEnter={checkIfLangWarnApplies}
                  onMouseLeave={handleLangWarnClose}
               >
                  <Button size="large" onClick={showLangConfig} disabled={!userIsAuthorized}>
                     {activeLanguage?.lang["Change Language"]}
                  </Button>
               </div>
            </Popover>
         </div>
         <div className="flex mt-2" style={{  width: "100%", justifyContent: "flex-end", marginBottom: "-5px" }}>
            <div className="flex" style={{  }}>
            <div style={{ width: "40%", paddingRight: "6px" }}>
               <Select
                  style={{ width: "100%" }}
                  allowClear={true}
                  disabled={!!store.selectedOrgUnit}
                  placeholder={activeLanguage?.lang["Level"] ?? "Level"}
                  onChange={store.setSelectedLevel}
                  size="large"
                  value={store.selectedLevel}
               >
                  <Option value={1}>Level 1</Option>
                  <Option value={2}>Level 2</Option>
                  <Option value={3}>Level 3</Option>
                  <Option value={4}>Level 4</Option>
                  <Option value={5}>Level 5</Option>
               </Select>
            </div>
            <div style={{ width: "60%", paddingLeft: "6px" }}>
               <RangePicker
                  style={{ width: "100%" }}
                  defaultValue={defaultRange}
                  onChange={handleSelect}
                  format="YYYY-MM-DD"
                  size="large"
               />
            </div>
            </div>
           
         </div>
      </Spin>
   );
});
