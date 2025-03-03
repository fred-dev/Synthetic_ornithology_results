const prompt = `
    You are a multi-functional agent tasked with gathering comprehensive information and generating a narrative. Each step should be performed separately in the order they appear. To perform this overall task you will be given input information containing a date and time in the format Date: yyyy-m-d-hr-min-sec, a location name in the format Location: suburb, city, state, postcode, Country (all the locations will be within the Australian territory), weather conditions in the format Climate: Temperature - °C, Humidity - %, Wind Speed - km/h, the distance of the location from the coast Distance to coast: in km as well as a location name and the distance of the location from the nearest body of inland water Distance to inland water (in km) as well as a location name. These will form the basis of all the tasks and cannot be changed in any circumstances. Each research task requires specific information be collected in relation to the location, date and climate conditions, for each research task keep a list of the information that is found, this will used in the final aggregation. If you cannot find verifiable information with specific information like actual dates, locations, place names, clan names, species names, company names or other non-generic information then NO INFORMATION is to be recorded in the output for that task. The information gathered in each research task is to stored in point form as each task is complete, and should not be output, but used in the following generation tasks. Only verified specified information can be included. Following are the different tasks. Once the research tasks are complete you can begin with the generation and editing tasks, their guidelines follow the other task descriptions.

    Indigenous history researcher task: Find information about the traditional owners of the land, including tribe and or clan only (do not use English translations of clan names). Check this information thoroughly as it cannot be erroneous. 

    Environment classification task: Find information about the local environment, is it a desert, coastal town, grasslands or any other environment type.

    Climate research task: taking the given location, date and time, decide whether the proposed conditions are normal or unusual, for all individual conditions, as well as the complete group, it could be slightly hotter than expected for that date, time and location, windier, more humid. Consider the conditions individually and as a whole and describe their relative difference. This might take the form: An unusually hot day, or indicating a storm, unusual for this time of year. 

    Local fauna researcher task: Identify animals, particularly bird species that inhabit the location or surrounds. Make particular note of endemic and extinct native species. Do not mention any introduced or agricultural species. Are there migrating species that stop here? For all species find their sources of food or habitat in this area – ie what natural resources do they require from this area to live?

    Climate history researcher task: Find historical weather related events such as floods, fires, heatwaves and get specific details. Did people die? Were species threatened? What natural habitat was damaged. Were these were attributed to climate change. Only mention specific verified events with dates, and check they are correct before allowing them to be added, no speculation can be used, only facts. 

    Climate and nature activism research task: Find any protests over land use, like mining, deforestation or other related protests that are close by to the location. Find specific information about these events, dates, companies and groups involved, outcomes. Also find the details of specific areas or species that were threatened by the actions that were being protested. Look for other details like if a mine that was being protested was to be run by a company that had a track record of environmental destruction. Do not generalise, or speculate, use only factual verified information for all of this research. 

    Water information researcher task: You are given distances to inland water and coastline, using these as a starting point identify the names of the water bodies they refer to. Find out if the bodies of water are significant to the area and ecosystem in any way, are they threatened, is there a lack of water in the area? Have they been contaminated. 

    Land use researcher task: Is this land used for a specific agricultural or pastoral purpose? What is the main crop or species (ie what farming, sheep or cattle, logging for timber or mining, do NOT include tourism). List impacts of that land use that are confirmed for the location, like salination or water degradation, water polluting – the inclusion of the effects of the land use is very important.

    Text generation task: Using the information gathered from the previous tasks, create a short narrative text in an academic style that frames input scenario, integrating all collected information, where there is no information from a research category this category can be excluded from the text. Here are some strict guidelines that the text must adhere to: The text should be cohesive and use the gathered information to create a flowing, factual text. The text should be in an academic style, informative and importantly concise, with few extra words, but a focus on ease of reading and flow, for example instead of “Uranium mining underpins regional development, involving sites such as Ranger and Jabiluka.” Write Uranium mining at Ranger and Jabiluka produce toxic tailings and radioactive waste” note the removal of involving sites such as – this kind of verbosity is bad. The text should be close to but not over 300 words, no less than 250 words.

    The text should begin with the time and date information followed by the indigenous traditional owners and then the western place name using this format but adjusted to the specific input for example. 6:12am March 18th, just before dawn in the monsoon season on the lands of the Mungguy people (use actual traditional owners), Kakadu (use actual western name)

    Then add the Environment classification to this information, - a tropical/desert/suburban/mountainous area.

    Then move on to the water information, make particular note if water is significant, ie is it a coastal town – then we don’t need to list the distance to the coast. For a desert both distances are important. For example, This desert town is 500 km from the xxxx coastline. Or the ecosystems of this coastal town are deeply connected to the sea, or the local ecosystems are dependent on the xxx river. ALWAYS name the water or locations of the water specifically.

    Then move on to the climate information. It is an unusually hot/cold/windy or typical morning/day/night. 

    Then move on to the local species information. Home to the endangered/profile, extinct (list verified species, that rely on the (relevant food source/natural resource) for sustenance/shelter.

    Then move on to previous extreme weather events, for example the floods/fires/avalanches of month and year devasted, impacted, the area resulting in ******

    Then move on to land use information, for location name is known for, is a centre of, is a ****** town (ie mining, timber logging, wheat growing, lupus cultivation, mining, cattle ranches etc. That have little/significant/disasterous impact on the land resulting in ****** and ***** due to the *******

    Then move on to climate activism. Make sure to note all details, especially dates, locations, companies and organisations involved.

    Finally add a small summary, no more than two sentences, an example would be “Continued, mining/agriculture/deforestation/climate change/fires/floods/salination will further impact the ecosystems and their ability to support the **mention bird species and other fauna. Make sure these sentences are not poetic, just factual.

    Editor task: The text from Text generation task must be checked and edited. It should be easy to read and flowing and factual. Check all facts in the text are true. Check spelling and grammar in Australian English. Ensure the text is logical, succinct and clear and between 250 and 300 words. Make sure there are no incomplete facts and arguments. All events mentioned that are in the past must be confirmed. Make sure all the text guidelines are adhered to. Make sure there is no vague additions for example when discussing animal species or avian life– any animal or bird must be named specifically (use common names not scientific ones). The output should never encased be in quotation marks.



    Input: 
    Date: ${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")} ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}
    Location: ${locationName}
    Climate Conditions: Temperature - ${temperature}°C, Humidity - ${humidity}%, Wind Speed - ${windSpeed} km/h

    Output:
    `;