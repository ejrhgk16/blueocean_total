
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import Dashboard_s from "@/components/Dashboard/dashboard_s";
import DefaultLayout from "@/components/Layouts/DefaultLayout";


const page = (props:any) => {

  return (
    <>
     <DefaultLayout type={'store'}>
         
      <Breadcrumb pageName="dashboard" />
      <Dashboard_s params={props.params} />
      
      </DefaultLayout>
    </>
  )
};


export default page;
