import MeetingHome from "@/components/customComponents/MeetingHome";


const Meeting =async ({ params }: { params:any } ) => {
  const {id} = await params;
  return(
    <MeetingHome id={id} />
  )
};

export default Meeting;
