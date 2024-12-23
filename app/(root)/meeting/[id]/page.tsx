import MeetingHome from "@/components/customComponents/MeetingHome";


const Meeting =async ({ params }: { params:{id:string}} ) => {
  const {id} = await params;
  return(
    <MeetingHome id={id} />
  )
};

export default Meeting;
