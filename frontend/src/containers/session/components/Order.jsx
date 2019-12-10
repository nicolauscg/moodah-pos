import React from "react";
import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@material-ui/icons/Add";
import ClearIcon from "@material-ui/icons/Clear";
import Typography from "@material-ui/core/Typography";

import IconButton from "../../../shared/components/IconButton";

const Order = ({
  handleMinus,
  handlePlus,
  handleCross,
  quantity,
  name,
  price
}) => {
  return (
    <div className="d-flex align-items-center">
      <IconButton icon={<RemoveIcon />} onPress={handleMinus} red />
      <Typography variant="body1" component="p" className="px-3">
        {quantity}
      </Typography>
      <IconButton icon={<AddIcon />} onPress={handlePlus} />
      <Typography variant="body1" component="p" className="flex-grow pl-3">
        {name}
      </Typography>
      <Typography variant="body1" component="p" className="pr-3">
        Rp {price}
      </Typography>
      <IconButton icon={<ClearIcon />} onPress={handleCross} red />
    </div>
  );
};

export default Order;
