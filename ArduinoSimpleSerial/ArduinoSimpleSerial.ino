#include <Adafruit_NeoPixel.h>
#include <avr/power.h>

// Which pin on the Arduino is connected to the NeoPixels?
// On a Trinket or Gemma we suggest changing this to 1
#define PIN            6

// How many NeoPixels are attached to the Arduino?
#define NUMPIXELS      118


Adafruit_NeoPixel pixels = Adafruit_NeoPixel(NUMPIXELS, PIN, NEO_GRB + NEO_KHZ800);

int delayval = 2;

//Led Parameters
const int blowPin = 10;
const int pwmPin = 3;

// LED read vars
String inputString = "";         // a string to hold incoming data
boolean blinker = false;  // whether the string is complete
boolean handInZone = false; 

void setup() {
  // initialize serial:
  Serial.begin(9600);
  pinMode(10, OUTPUT);
  pixels.begin(); // This initializes the NeoPixel library.
  //changeSame("red");
  changeTwoDiff();
}

void loop() {
  
  // put your main code here, to run repeatedly:
  while (Serial.available() && blinker == false && handInZone == false) {
    char inChar = (char)Serial.read();
    if(inChar == 'E'){ // end character for toggle LED
     blinker = true;
    }
    if(inChar == 'P'){// end character for dim LED
     handInZone = true;
    }
    else{
      inputString += inChar; 
    }
  }
  //Invoked when knocking gesture occures
  if(!Serial.available() && blinker == true){
    // convert String to int. 
    int recievedVal = stringToInt();
    if(recievedVal == 0){
      changeTwoDiff();
    } else if(recievedVal == 1){
      changeSame("green");
    } else if(recievedVal == 2){
      changeSame("red");
    }    
    blinker = false;
  }
  //Evoked on hand visible
  if(!Serial.available() && handInZone == true){
    // convert String to int
    int recievedVal = stringToInt();
    if(recievedVal == 0){
      digitalWrite(blowPin, HIGH);
    }else{
      digitalWrite(blowPin, LOW);
    }
    handInZone = false;
  }
  delay(50);
}

int stringToInt(){
    char charHolder[inputString.length()+1];
    inputString.toCharArray(charHolder,inputString.length()+1);
    inputString = "";
    int _recievedVal = atoi(charHolder);
    return _recievedVal;
  }
  
void changeTwoDiff(){
   for(int i=0;i<NUMPIXELS/2;i++){

    // pixels.Color takes RGB values, from 0,0,0 up to 255,255,255
    pixels.setPixelColor(i, pixels.Color(0,255,0)); // Moderately bright green color.

    pixels.show(); // This sends the updated pixel color to the hardware.

    delay(delayval); // Delay for a period of time (in milliseconds).
  }
  for(int i=NUMPIXELS/2;i<NUMPIXELS;i++){

    // pixels.Color takes RGB values, from 0,0,0 up to 255,255,255
    pixels.setPixelColor(i, pixels.Color(255/10,0,0)); // Moderately bright red color.

    pixels.show(); // This sends the updated pixel color to the hardware.

    delay(delayval); // Delay for a period of time (in milliseconds).
  }
}

void changeSame(String color){
   for(int i=0;i<NUMPIXELS;i++){
   Serial.println("in change same!");
    // pixels.Color takes RGB values, from 0,0,0 up to 255,255,255
    
    if(color.equals("green")){
      pixels.setPixelColor(i, pixels.Color(0,255/10,0)); // Moderately bright green color.
    }else if(color.equals("red")){
      pixels.setPixelColor(i, pixels.Color(255,0,0)); // Moderately bright red color.
    }
    pixels.show(); // This sends the updated pixel color to the hardware.

    delay(delayval); // Delay for a period of time (in milliseconds).
  } 
}
