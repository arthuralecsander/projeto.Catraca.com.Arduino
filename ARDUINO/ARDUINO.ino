#include <SPI.h>
#include <MFRC522.h>
#include <LiquidCrystal.h>

#define SS_PIN 10
#define RST_PIN 9
MFRC522 mfrc522(SS_PIN, RST_PIN); // Create MFRC522 instance.
byte cardPresent;

LiquidCrystal lcd(6, 7, 5, 4, 3, 2);
String inputString = "";   

void setup() {
Serial.begin(9600); // Initialize serial communications with the PC
SPI.begin(); // Init SPI bus
lcd.begin(16, 2);
mfrc522.PCD_Init(); // Init MFRC522 card
inputString.reserve(200);
//Serial.println("Ready to read!");
}

void loop(){
  inputString = "";
  // Look for new cards
  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()){

  //Serial.print("Card UID:");
  for (byte i = 0; i < mfrc522.uid.size; i++) {
    //Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
    //Serial.print(mfrc522.uid.uidByte[i], HEX);
    inputString +=  String(mfrc522.uid.uidByte[i],HEX);
    
  } 
      Serial.println(inputString);
      String StringOriginal = Serial.readString();
      lcd.print(StringOriginal.substring(0,16));
      lcd.setCursor(0,1);
      lcd.print(StringOriginal.substring(16));
      
    //lcd.print(Serial.readString());
    delay(1500);
    lcd.clear(); 
  }
}
