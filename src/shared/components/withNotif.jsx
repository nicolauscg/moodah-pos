import { connect } from "react-redux";
import { addNotif } from "../../redux/modules/general";

export default connect(null, dispatch => ({
  triggerNotif: notif => dispatch(addNotif(notif))
}))