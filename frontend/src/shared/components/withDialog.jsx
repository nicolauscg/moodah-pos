import { connect } from "react-redux";
import { showDialog } from "../../redux/modules/general";

export default connect(null, dispatch => ({
  triggerDialog: dialog => dispatch(showDialog(dialog))
}))