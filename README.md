## Introduction

A project about exploring different tools and techniques that provide a simple overview about myself based on my shopping habits.
The list of purchases from 2018 was gathered from S Group's website by polling the website's API interface ([example code of fetching](https://github.com/letsirk/EIV/tree/master/fetch%20data%20from%20foodie)). Then, the gathered data was analyzed and processed. As last, an interactive [visualization](https://letsirk.github.io/EIV/) was designed and created to support the exploring of monthly purchases. A report about the whole process can be found [here](https://github.com/letsirk/EIV/blob/master/EIV-report-purchases-in-s-group.pdf). 

The project was accomplished during *Explorative Information Visualization* course and continuous to this course, [a research project](https://github.com/letsirk/eiv-research-project) related to Machine Learning and Data Science was performed. 

## Techniques and Tools

The project utilizes following techniques and tools:
* JavaScript to collect, preprocess, aggregate and visualize data
  * the preprocessed data is turned into JSON array which is aggregated using [lodash](https://lodash.com/) library
  * the aggregated data is visualized using a circular layout of a scatter graph ([CircoJS](https://github.com/nicgirault/circosJS) based on 3D.js)
  * the scatter graph is modified to fit the design of the project
* Tools to make the visualization color-friendly for users with disabilities to see colors or their differences
  * [Coblis](https://www.color-blindness.com/coblis-color-blindness-simulator/) tool to test different color disabilities 
  * [ColorBrewer](https://colorbrewer2.org/#type=sequential&scheme=BuGn&n=7) tool to select colors from colorblind friendly palette


