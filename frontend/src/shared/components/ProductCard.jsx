import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

import NoImage from "../../shared/img/pos/noImage.png";

const styles = {
  card: {
    width: 110
  },
  media: {
    height: 110,
    objectFit: "cover"
  },
  name: {
    lineHeight: 1.2
  }
};

const MediaCard = ({ classes, className, name, image, price }) => {
  return (
    <Card className={`${classes.card} ${className}`}>
      <CardActionArea>
        <img
          className={classes.media}
          src={image ? `data:image/png;base64,${image}` : NoImage}
        />
        <CardContent className="p-1">
          <Typography
            className={`${classes.name} font-weight-bold`}
            gutterBottom
            variant="caption"
            component="h2"
          >
            {name}
          </Typography>
          {price && (
            <Typography variant="caption" component="p">
              {`Rp. ${price}`}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default withStyles(styles)(MediaCard);
