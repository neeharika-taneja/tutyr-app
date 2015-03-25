import java.util.Arrays;
import java.util.Collections;
import java.util.List;

// Ketai is a Processing support library that lets you do multitouch and
// other fancy stuff on Android. install in Processing: Android Mode | Tools > Add Tool > Ketai
// import ketai.ui.*;

///////////// VARIABLE DECLARATIONS /////////////
// Scale vars
float scaleFactor;
float translateX;
float translateY;

// Typing variables
String[] phrases;
int totalTrialNum = 4; //the total number of phrases to be tested - set this low for testing. Might be ~10 for the real bakeoff!
int currTrialNum = 0; // the current trial number (indexes into trials array above)
float startTime = 0; // time starts when the first letter is entered
float finishTime = 0; // records the time of when the final trial ends
float lastTime = 0; //the timestamp of when the last trial was completed
float lettersEnteredTotal = 0; //a running total of the number of letters the user has entered (need this for final WPM computation)
float lettersExpectedTotal = 0; //a running total of the number of letters expected (correct phrases)
float errorsTotal = 0; //a running total of the number of errors (when hitting next)
String currentPhrase = ""; //the current target phrase
String currentTyped = ""; //what the user has typed so far
int value = 0;
boolean left = false;
boolean center = false;
boolean right = false;

boolean zoomed = false;
List<Integer> currentSubset = Arrays.asList(0);
// Keyboard variables
List<String> kbRow1 = Arrays.asList("q", "w", "e", "r", "t", "y", "u", "i", "o", "p");
List<String> kbRow2 = Arrays.asList("a", "s", "d", "f", "g", "h", "j", "k", "l");
List<String> kbRow3 = Arrays.asList("z", "x", "c", "v", "b", "n", "m", "<");
List<String> kbRow4 = Arrays.asList(" ", " ", " ", " ", " ", " ", " ", " ", " ", " ");
final int maxKeysPerRow = kbRow1.size(); // Assuming qwerty
HashMap<ArrayList, Character> keyLocations = new HashMap<ArrayList, Character>();

// Drawing variables
final int DPIofYourDeviceScreen = 445; //you will need to look up the DPI or PPI of your device to make sure you get the right scale!!
                                      //http://en.wikipedia.org/wiki/List_of_displays_by_pixel_density
final float sizeOfInputArea = DPIofYourDeviceScreen*1; //aka, 1.0 inches square!
final float screenStart = 200;

//You can modify anything in here. This is just a basic implementation.
void setup()
{
  phrases = loadStrings("phrases2.txt"); //load the phrase set into memory
  Collections.shuffle(Arrays.asList(phrases)); //randomize the order of the phrases
    
  orientation(PORTRAIT); //can also be LANDSCAPE -- sets orientation on android device
  size(1000, 1000); //Sets the size of the app. You may want to modify this to your device. Many phones today are 1080 wide by 1920 tall.
  textFont(createFont("Arial", 24)); //set the font to arial 24
  scaleFactor = 1;
}

void draw()
{
  background(0); //clear background
  fill(100);
  
    
  // Start drawing

  // SCALING: DON'T CHANGE! /////////////////
  // pushMatrix();                             //
  // translate(translateX,translateY);        //
  // scale(scaleFactor);                       //
  // ///////////////////////////////////////////
  
  rect(screenStart, screenStart, sizeOfInputArea, sizeOfInputArea);
  
  if (finishTime!=0)
  {
    fill(255);
    textAlign(CENTER);
    text("Finished", 280, 150);
    return;
  }

  if (startTime==0 & !mousePressed)
  {
    fill(255);
    textAlign(CENTER);
    text("Click to start time!", 280, 150); //display this messsage until the user clicks!
  }

  if (startTime==0 & mousePressed)
  {
    nextTrial(); //start the trials!
  }

  if (startTime!=0)
  {
    //you will need something like the next 10 lines in your code. Output does not have to be within the 2 inch area!
    textSize(24);
    textAlign(LEFT); //align the text left
    fill(128);
    text("Phrase " + (currTrialNum+1) + " of " + totalTrialNum, 70, 50); //draw the trial count
    fill(255);
    text("Target:   " + currentPhrase, 70, 100); //draw the target string
    text("Entered:  " + currentTyped, 70, 140); //draw what the user has entered thus far 
    fill(255, 0, 0);
    rect(800, 00, 200, 200); //drag next button
    fill(255);
    text("NEXT > ", 850, 100); //draw next label

    // draw keyboard rows
    textSize(48);
    if (zoomed == false){
			drawWholeKeyboard();
		} else { 
			drawSubset(currentSubset.get(0), currentSubset.get(1));
		}
  }
  // popMatrix();
}

///////// KEYBOARD DRAWING CODE //////////////
void drawKeys(List<String> row, int rowNumber) {
  for (int i=0; i<row.size(); i++) {
    float keyWidth = sizeOfInputArea/maxKeysPerRow;
    float keyHeight = sizeOfInputArea / 4; // magic number: we're assuming 4 rows
    float offset = (row.size() - maxKeysPerRow) * keyWidth/2;
    float keyX = screenStart + (i * sizeOfInputArea / maxKeysPerRow) - offset;
    float keyY = screenStart + (rowNumber-1) * keyHeight;
    
    ArrayList<Float> thisKeyBounds = new ArrayList<Float>();
    
    thisKeyBounds.add(keyX); thisKeyBounds.add(keyY);
    thisKeyBounds.add(keyWidth); thisKeyBounds.add(keyHeight);
    keyLocations.put(thisKeyBounds, row.get(i).charAt(0));

  
    fill(255);
    rect(keyX, keyY, keyWidth, keyHeight);
    fill(0);
    text(row.get(i).charAt(0), keyX+(keyWidth/5), keyY+50, 100);
  }
}

void drawKeysSubset(List<String> row, int start, int stop, int rowNumber) {
  int finish;
  if ( stop >= row.size() ) {
    finish = row.size();
  } else {
    finish = stop;
  }
  int maxKeysPerSubsetRow = finish - start + 1;
  
  int pos = 0; // Declaring a dummy variable for positioning
  for (int i=start; i<finish; i++) {
	  float keyWidth = sizeOfInputArea/maxKeysPerSubsetRow;
	  float keyHeight = sizeOfInputArea / 4; // magic number: we're assuming 4 rows
	  float offset = (row.size() - maxKeysPerSubsetRow) * keyWidth/2;
	  float keyX = screenStart + (pos * sizeOfInputArea / maxKeysPerSubsetRow);
	  float keyY = screenStart + (rowNumber-1) * keyHeight;
  
	  ArrayList<Float> thisKeyBounds = new ArrayList<Float>();
  
	  thisKeyBounds.add(keyX); thisKeyBounds.add(keyY);
	  thisKeyBounds.add(keyWidth); thisKeyBounds.add(keyHeight);
	  keyLocations.put(thisKeyBounds, row.get(i).charAt(0));
  
	  fill(255);
	  rect(keyX, keyY, keyWidth, keyHeight);
	  fill(0);
	  textSize(48);
	  text(row.get(i).charAt(0), keyX+(keyWidth/5), keyY+50, 100);
	  pos++;    
  }
}

void drawWholeKeyboard() {
  drawKeys(kbRow1, 1);
  drawKeys(kbRow2, 2);
  drawKeys(kbRow3, 3);  
  drawKeys(kbRow4, 4);
}

void drawSubset(int start, int finish) {
  drawKeysSubset(kbRow1, start, finish, 1);
  drawKeysSubset(kbRow2, start, finish, 2);
  drawKeysSubset(kbRow3, start, finish, 3);
  drawKeysSubset(kbRow4, start, finish, 4);
}

///////// MOUSE HANDLING CODE ////////////////

boolean didMouseClick(float x, float y, float w, float h) //simple function to do hit testing
{  
  // // Translate mouse click coordinates by scaling and movement
  // x *= scaleFactor; x += translateX;
  // y *= scaleFactor; y += translateY;
  //
  // // Click targets are also appropriately scaled
  // w *= scaleFactor;
  // h *= scaleFactor;
  
  return (mouseX > x && mouseX<x+w && mouseY>y && mouseY<y+h); //check to see if it is in button bounds
}

void mousePressed()
{

  System.out.println(mouseX);
  System.out.println(mouseY);
  if (zoomed == false && startTime != 0){
    if (mouseX > 200 && mouseX < 375 && mouseY > 200 && mouseY < 645){
      zoomed = true;
			currentSubset = Arrays.asList(0, 3);
    }
    else if (mouseX > 375 && mouseX < 510 && mouseY > 200 && mouseY < 645){
      System.out.println("here");
      zoomed = true;
			currentSubset = Arrays.asList(3, 6);
    }
    else if (mouseX > 510 && mouseX < 640 && mouseY > 200 && mouseY < 645){
      zoomed = true;
			currentSubset = Arrays.asList(6,10);
    }
	} else { 
	  for (ArrayList key : keyLocations.keySet()) {
	    float corner0 = (Float)key.get(0);
	    float corner1 = (Float)key.get(1);
	    float corner2 = (Float)key.get(2);
	    float corner3 = (Float)key.get(3);
	    if (didMouseClick(corner0, corner1, corner2, corner3)){
	      if ( keyLocations.get(key) != "<".charAt(0) ) { 
	        currentTyped += keyLocations.get(key);
	        zoomed = false;
	        break;
				} else {
					// Delete key
	        currentTyped = currentTyped.substring(0, currentTyped.length()-1);        
	      }      
     
	      System.out.println(keyLocations.get(key));
	    }  
	  }
  }

  // Next Button
  if (didMouseClick(800, 00, 200, 200)) //check if click is in next button
  {
    nextTrial(); //if so, advance to next trial
  }
  
}

//void mouseWheel(MouseEvent e)
//{
//  translateX = translateX-e.getAmount()*(mouseX)/100;
//  translateY = translateY-e.getAmount()*(mouseY)/100;
//  scaleFactor += e.getAmount() / 100;
//}


///////// TRIAL HANDLING CODE ////////////////

void nextTrial()
{
  if (currTrialNum >= totalTrialNum) //check to see if experiment is done
    return; //if so, just return

    if (startTime!=0 && finishTime==0) //in the middle of trials
  {
    System.out.println("==================");
    System.out.println("Phrase " + (currTrialNum+1) + " of " + totalTrialNum); //output
    System.out.println("Target phrase: " + currentPhrase); //output
    System.out.println("Phrase length: " + currentPhrase.length()); //output
    System.out.println("User typed: " + currentTyped); //output
    System.out.println("User typed length: " + currentTyped.length()); //output
    System.out.println("Number of errors: " + computeLevenshteinDistance(currentTyped.trim(), currentPhrase.trim())); //trim whitespace and compute errors
    System.out.println("Time taken on this trial: " + (millis()-lastTime)); //output
    System.out.println("Time taken since beginning: " + (millis()-startTime)); //output
    System.out.println("==================");
    lettersExpectedTotal+=currentPhrase.length();
    lettersEnteredTotal+=currentTyped.length();
    errorsTotal+=computeLevenshteinDistance(currentTyped.trim(), currentPhrase.trim());
  }

  if (currTrialNum == totalTrialNum-1) //check to see if experiment just finished
  {
    finishTime = millis();
    System.out.println("==================");
    System.out.println("Trials complete!"); //output
    System.out.println("Total time taken: " + (finishTime - startTime)); //output
    System.out.println("Total letters entered: " + lettersEnteredTotal); //output
    System.out.println("Total letters expected: " + lettersExpectedTotal); //output
    System.out.println("Total errors entered: " + errorsTotal); //output
    System.out.println("WPM: " + (lettersEnteredTotal/5.0f)/((finishTime - startTime)/60000f)); //output
    System.out.println("==================");
    currTrialNum++; //increment by one so this mesage only appears once when all trials are done
    return;
  }

  if (startTime==0) //first trial starting now
  {
    System.out.println("Trials beginning! Starting timer..."); //output we're done
    startTime = millis(); //start the timer!
  }
  else
  {
    currTrialNum++; //increment trial number
  }

  lastTime = millis(); //record the time of when this trial ended
  currentTyped = ""; //clear what is currently typed preparing for next trial
  currentPhrase = phrases[currTrialNum]; // load the next phrase!
  //currentPhrase = "abc"; // uncomment this to override the test phrase (useful for debugging)
}




//=========SHOULD NOT NEED TO TOUCH THIS AT ALL!==============
int computeLevenshteinDistance(String phrase1, String phrase2)  
{
  int[][] distance = new int[phrase1.length() + 1][phrase2.length() + 1];

  for (int i = 0; i <= phrase1.length(); i++)
    distance[i][0] = i;
  for (int j = 1; j <= phrase2.length(); j++)
    distance[0][j] = j;

  for (int i = 1; i <= phrase1.length(); i++)
    for (int j = 1; j <= phrase2.length(); j++)
      distance[i][j] = min(min(distance[i - 1][j] + 1, distance[i][j - 1] + 1), distance[i - 1][j - 1] + ((phrase1.charAt(i - 1) == phrase2.charAt(j - 1)) ? 0 : 1));

  return distance[phrase1.length()][phrase2.length()];
}