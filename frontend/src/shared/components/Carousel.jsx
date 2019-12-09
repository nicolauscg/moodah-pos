import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import { unstable_useMediaQuery as useMediaQuery } from "@material-ui/core/useMediaQuery";
import MobileStepper from "@material-ui/core/MobileStepper";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import SwipeableViews from "react-swipeable-views";

import IconButton from "./IconButton";

const styles = theme => ({
  root: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative"
  },
  carousel: {
    width: "100%"
  },
  item: {
    display: "flex",
    flexBasis: "33.33%",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      flexBasis: "50%"
    }
  },
  backIcon: {
    position: "absolute",
    left: 0,
    top: "50%",
    transform: "translateY(-50%)"
  },
  forwardIcon: {
    position: "absolute",
    right: 0,
    top: "50%",
    transform: "translateY(-50%)"
  },
  mobileStepper: {
    backgroundColor: "inherit"
  }
});

const SwipeableTextMobileStepper = ({ children, classes, theme }) => {
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const itemsPerSlide = isSmallScreen ? 2 : 3;
  const boxedChildren = children.reduce(
    (rows, key, index) =>
      (index % itemsPerSlide == 0
        ? rows.push([key])
        : rows[rows.length - 1].push(key)) && rows,
    []
  );
  const maxSteps = boxedChildren.length;
  const [activeStep, setActiveStep] = useState(0);
  const handleNext = () => setActiveStep(Math.min(activeStep + 1, maxSteps));
  const handleBack = () => setActiveStep(Math.max(activeStep - 1, 0));

  return (
    <div className={classes.root}>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={activeStep}
        onChangeIndex={setActiveStep}
        enableMouseEvents
        className={classes.carousel}
      >
        {boxedChildren.map(slide => (
          <div className="d-flex my-1">
            {slide.map(item => (
              <div className={classes.item}>{item}</div>
            ))}
          </div>
        ))}
      </SwipeableViews>
      <MobileStepper
        variant="dots"
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        className={classes.mobileStepper}
      />
      {activeStep > 0 && (
        <div className={classes.backIcon}>
          <IconButton icon={<ArrowBackIcon />} onPress={handleBack} />
        </div>
      )}
      {activeStep < maxSteps - 1 && (
        <div className={classes.forwardIcon}>
          <IconButton icon={<ArrowForwardIcon />} onPress={handleNext} />
        </div>
      )}
    </div>
  );
};

const Carousel = withStyles(styles, { withTheme: true })(
  SwipeableTextMobileStepper
);

export default Carousel;
