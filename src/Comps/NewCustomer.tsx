import React, { useState,useEffect,useRef } from "react";
import { useDispatch } from "react-redux";
import DeskTop from "./DeskTop";
import { addnewCustomer } from "./Slices/CustomerSlice";
import { AppDispatch } from "./Store/Store";
import { Alert , Snackbar} from '@mui/material';

const createInitialCustomerData = () => ({
  customerID: 0,
  custTitle: "",
  firstName: "",
  middleName: "",
  lastName: "",
  surName: "",
  sex: "",
  custEmail: "",
  dateOfbirth: new Date(),
  age: 0,
  address1: "",
  address2: "",
  address3: "",
  areaPin: "",
  dateofEnquiry: new Date(),
  mobile: "",
  createdOn: new Date(),
  createdBy: "",
  modifiedBy: "",
  modifiedOn: "",
});

const toDateInputValue = (value: Date) => {
  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const NewCustomer: React.FC = () => {
   const [date, setDate] = useState(new Date());
    const[action,setAction]=useState(0);
  const [custData, setCustData] = useState(createInitialCustomerData);
  const [age, setAge] = useState(0);
  const [ageInput, setAgeInput] = useState("");
  const [showAgePopup, setShowAgePopup] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
 const [resetTrigger, setResetTrigger] = useState(false);
  const[btncaption,setCaption]=useState("No Action");
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);
  const ageref=useRef<HTMLInputElement>(null)
  const updateField = (
    field: keyof typeof custData,
    value: string | Date
  ) => {
    setCustData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const calculateAge = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || !event.currentTarget.value) return;

    event.preventDefault();

    const birthDate = new Date(`${event.currentTarget.value}T00:00:00`);
    const today = new Date();

    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const birthdayHasNotOccurred =
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate());

    if (birthdayHasNotOccurred) calculatedAge -= 1;

    setAge(calculatedAge);
  };

  const applyAge = () => {
    const years = Number(ageInput);

    if (!Number.isInteger(years) || years < 0 || years > 130) return;

    const today = new Date();
    const targetYear = today.getFullYear() - years;
    const targetDay = Math.min(
      today.getDate(),
      new Date(targetYear, today.getMonth() + 1, 0).getDate()
    );

    const birthDate = new Date(
      targetYear,
      today.getMonth(),
      targetDay
    );

    setCustData((current) => ({
      ...current,
      dateOfbirth: birthDate,
    }));
    setAge(years);
    setAgeInput("");
    setShowAgePopup(false);
  };

  const resetScreen = () => {
    setCustData(createInitialCustomerData());
    setAge(0);
    setAgeInput("");
    setShowAgePopup(false);
    setResetTrigger(true);
    setAction(1);
    setCaption("Add New Customer");
    titleInputRef.current?.focus();
     
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {

        const form = e.currentTarget;
        const formData = new FormData(form);
        
        const today=new Date().getFullYear();
        // Construct the JSON object
        const customereaddDataobj = {
            custTitle:formData.get('txttitl'),
            firstName:formData.get('txtfirstname'),
            middleName:formData.get('txtmiddlename'),
            lastName:formData.get('lastname'), 
            sex:formData.get('sex'),
            custEmail:formData.get('txtemail'),
            dateOfbirth:formData.get('dateofBirth'), 
            address1:formData.get('address'),
            addresss2:formData.get('address2'),
            address3:formData.get('address3'),  
            areaPin:formData.get('txtpin'),   
            dateofEnquiry:formData.get('txtenquery'), 
            mobile:formData.get('txtmobile'),
            age:age,
         createdOn:date.toISOString().split("T")[0],
          createdBy:localStorage.getItem("userName")
        };
        
          let response;
         if(action===1)
         {
          const activeElement = document.activeElement as HTMLElement;
            const doc=activeElement?.getAttribute("name");
           
          if(doc==="btnAdd")
          {
            var strngframe=JSON.stringify(customereaddDataobj)
             
            var customerData=JSON.parse(strngframe);
             response= await dispatch(addnewCustomer(customerData)).unwrap();
             if(response?. customerID>0)
                 setSuccessMessage('Data updated successfully');
          }
        }
        // Optionally, reset the form or display a success message
    } catch (err) {
      // Handle error if needed
      setErrorMessage('Invalid User Name or Password');
    }
  };

  useEffect(() => {
  if (showAgePopup) {
    ageref.current?.focus();
  }
}, [showAgePopup]);

   useEffect(() => {
    ageref.current?.focus();
    resetScreen();
    
  }, [resetTrigger]); // Runs when reset

  
 //const resetScreen=()=>{setResetTrigger(true);setAction(1);setCaption("Add New Customer")};
  return (
    <>
      <DeskTop />
    <Snackbar
  open={Boolean(successMessage)}
  autoHideDuration={4000}
  onClose={() => setSuccessMessage('')}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <Alert
    severity="success"
    variant="filled"
    onClose={() => setSuccessMessage('')}
  >
    {successMessage}
  </Alert>
</Snackbar>

<Snackbar
  open={Boolean(errorMessage)}
  autoHideDuration={6000}
  onClose={() => setErrorMessage('')}
  anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
>
  <Alert
    severity="error"
    variant="filled"
    onClose={() => setErrorMessage('')}
  >
    {errorMessage}
  </Alert>
</Snackbar>

      <form onSubmit={handleSubmit}>
        <div
          className="container col-sm-10"
          style={{
            marginTop: "2%",
            background: "#59afd5",
            color: "white",
            fontWeight: "bold",
            padding: "6px 12px",
          }}
        >
          New Customer Data Entry
        </div>

        <div className="card container col-sm-10" style={{ fontSize: "11px" }}>
          {/* Title, first name, and middle name */}
          <div className="row align-items-center" style={{ marginTop: "2%" }}>
            <div className="col-sm-2 text-end">
              <label htmlFor="title">Title</label>
            </div>
            <div className="col-sm-2">
              <input
                id="title"
                ref={titleInputRef}
                type="text"
                className="form-control"
                name="txttitl"
                value={custData.custTitle}
                onChange={(e) => updateField("custTitle", e.target.value)}
              />
            </div>

            <div className="col-sm-2 text-end">
              <label htmlFor="firstName">First Name</label>
            </div>
            <div className="col-sm-2">
              <input
                id="firstName"
                type="text"
                className="form-control"
                name="txtfirstname"
                value={custData.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
              />
            </div>

            <div className="col-sm-2 text-end">
              <label htmlFor="middleName">Middle Name</label>
            </div>
            <div className="col-sm-2">
              <input
                id="middleName"
                type="text"
                className="form-control"
                name="txtmiddlename"
                value={custData.middleName}
                onChange={(e) => updateField("middleName", e.target.value)}
              />
            </div>
          </div>

          {/* Last name, sex, and date of birth */}
          <div className="row align-items-center" style={{ marginTop: "2%" }}>
            <div className="col-sm-2 text-end">
              <label htmlFor="lastName">Last Name</label>
            </div>
            <div className="col-sm-2">
              <input
                id="lastName"
                type="text"
                className="form-control"
                name="lastname"
                value={custData.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
              />
            </div>

            <div className="col-sm-2 text-end">
              <label htmlFor="sex">Sex</label>
            </div>
            <div className="col-sm-2">
              <input
                id="sex"
                type="text"
                className="form-control"
                name="sex"
                value={custData.sex}
                onChange={(e) => updateField("sex", e.target.value)}
              />
            </div>

            <div className="col-sm-2 text-end">
              <label htmlFor="dob">Date of Birth</label>
            </div>

            <div className="col-sm-2 position-relative">
              <div className="d-flex align-items-center gap-1">
                <input
                  id="dob"
                  type="date"
                  className="form-control"
                  style={{ minWidth: 0, flex: 1 }}
                  name="dateofBirth"
                  value={toDateInputValue(custData.dateOfbirth)}
                  onKeyDown={calculateAge}
                  onChange={(e) =>
                    updateField(
                      "dateOfbirth",
                      new Date(`${e.target.value}T00:00:00`)
                    )
                  }
                />

                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  aria-label="Calculate date of birth from age"
                  onClick={() => {
                    setShowAgePopup((open) => !open);
                   
                  }}
                  style={{ flexShrink: 0 }}
                >
                  ⋯
                </button>
              </div>

              {showAgePopup && (
                <div
                  className="border rounded bg-white shadow p-2"
                  style={{
                    position: "absolute",
                    top: "calc(100% + 4px)",
                    right: 0,
                    zIndex: 10,
                    width: "180px",
                  }}
                >
                  <label htmlFor="ageInput" className="form-label mb-1">
                    Age in years
                  </label>

                  <input
                    id="ageInput"
                    type="number"
                    ref={ageref}
                    className="form-control form-control-sm"
                    min="0"
                    max="130"
                    value={ageInput}
                    onChange={(e) => setAgeInput(e.target.value)}
                    onKeyDown={(e) => {

                      if (e.key === "Enter") {
                        e.preventDefault();
                        applyAge();
                      }
                    }}
                  />

                  <div className="d-flex justify-content-end gap-1 mt-2">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      onClick={() => setShowAgePopup(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={applyAge}
                    >
                      Set
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Address, address 2, and purpose */}
          <div className="row align-items-center" style={{ marginTop: "2%" }}>
            <div className="col-sm-2 text-end">
              <label htmlFor="address">Address</label>
            </div>
            <div className="col-sm-2">
              <textarea
                id="address"
                className="form-control"
                name="address"
                rows={2}
                value={custData.address1}
                onChange={(e) => updateField("address1", e.target.value)}
              />
            </div>

            <div className="col-sm-2 text-end">
              <label htmlFor="address2">Address2</label>
            </div>
            <div className="col-sm-2">
              <textarea
                id="address2"
                className="form-control"
                name="address2"
                rows={2}
                value={custData.address2}
                onChange={(e) => updateField("address2", e.target.value)}
              />
            </div>

            <div className="col-sm-2 text-end">
              <label htmlFor="purpose">Purpose</label>
            </div>
            <div className="col-sm-2">
              <textarea
                id="purpose"
                className="form-control"
                name="address3"
                rows={2}
                value={custData.address3}
                onChange={(e) => updateField("address3", e.target.value)}
              />
            </div>
          </div>

          {/* Email and PIN */}
          <div className="row align-items-center" style={{ marginTop: "2%" }}>
            <div className="col-sm-2 text-end">
              <label htmlFor="email">Email</label>
            </div>
            <div className="col-sm-2">
              <input
                id="email"
                type="email"
                className="form-control"
                name="txtemail"
                value={custData.custEmail}
                onChange={(e) => updateField("custEmail", e.target.value)}
              />
            </div>

            <div className="col-sm-2 text-end">
              <label htmlFor="pin">Pin</label>
            </div>
            <div className="col-sm-2">
              <input
                id="pin"
                type="text"
                className="form-control"
                name="txtpin"
                value={custData.areaPin}
                onChange={(e) => updateField("areaPin", e.target.value)}
              />
            </div>
          </div>

          {/* Enquiry and mobile */}
          <div className="row align-items-center" style={{ marginTop: "2%" }}>
            <div className="col-sm-2 text-end">
              <label htmlFor="enquiry">Enquiry</label>
            </div>
            <div className="col-sm-2">
              <input
                id="enquiry"
                type="date"
                className="form-control"
                name="txtenquery"
                value={toDateInputValue(custData.dateofEnquiry)}
                onChange={(e) =>
                  updateField(
                    "dateofEnquiry",
                    new Date(`${e.target.value}T00:00:00`)
                  )
                }
              />
            </div>

            <div className="col-sm-2 text-end">
              <label htmlFor="mobile">Mobile</label>
            </div>
            <div className="col-sm-2">
              <input
                id="mobile"
                type="tel"
                className="form-control"
                name="txtmobile"
                value={custData.mobile}
                onChange={(e) => updateField("mobile", e.target.value)}
              />
            </div>
          </div>

          {/* Buttons */}
          <div
            className="row"
            style={{ marginTop: "2%", marginBottom: "2%" }}
          >
            <div className="col-sm-10 text-center">
              <button className="btn btn-primary" name="btnAdd" >{btncaption}</button>
              
              

              <button
                type="button"
                className="btn btn-primary"
                style={{ marginLeft: "2%" }}
                onClick={resetScreen}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default NewCustomer;