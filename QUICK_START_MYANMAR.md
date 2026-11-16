# SF Tech Store — မြန်မာလို Run လုပ်နည်း

**Developer:** Ko Kyi Phyu Aung  
**Email:** kyiphyuaung@strategyfirst.edu.mm

1. `SF_Tech_Store_Experience_Edition.zip` ကို Extract လုပ်ပါ။
2. Extract လုပ်ထားတဲ့ Folder ထဲက `START_WINDOWS.bat` ကို Double-click နှိပ်ပါ။ Python 3 ရှိဖို့လိုပါတယ်။
3. Browser မှာ `http://127.0.0.1:8765` ကိုဖွင့်ပါ။
4. စာမျက်နှာတွေကို စမ်းသပ်နိုင်ပါတယ်။ Project ကိုပိတ်ချင်ရင် Command Prompt ထဲမှာ `Ctrl + C` နှိပ်ပါ။

**စမ်းသပ်ဖို့:**

- **Shop all** → Product တွေကို Search / Filter / Sort လုပ်ကြည့်ပါ။
- **Apex Studio 16 / Orbit ANC Pro / Vector X9 Wireless** → Product Details မှာ **Rotate 360°** ကိုနှိပ်ပြီး ပုံပေါ် Drag လုပ်ပါ၊ ဒါမှမဟုတ် Slider ကိုရွှေ့ပါ။
- **Zoom view** → `+`, `−`, Mouse Wheel နဲ့ Zoom ဆွဲနိုင်ပြီး Zoom ထားတဲ့ပုံကို Drag လုပ်ရွှေ့နိုင်ပါတယ်။
- **Add to bag** → Shopping Cart ထဲ ပစ္စည်းထည့်၊ အရေအတွက်ပြောင်း၊ ဖယ်ရှားကြည့်ပါ။
- **Coupon:** `SF10` ထည့်ရင် 10% Discount ကို စမ်းပြနိုင်ပါတယ်။
- **Checkout** → လိုအပ်တဲ့ Information ဖြည့်ပြီး Order Confirmation Page ကို စမ်းကြည့်ပါ။
- **Dark/Light Mode** → အပေါ်က Theme Icon ကိုနှိပ်ပါ။
- **Wishlist / Compare** → Heart Icon နဲ့ ⇄ Icon တွေကို စမ်းကြည့်ပါ။

**မှတ်ချက်:** ဒီ Project မှာ Sample Product, Price နဲ့ Checkout Simulation တွေကိုသာ သုံးထားပါတယ်။ တကယ့် Payment လုပ်တာ၊ Product Order တင်တာ၊ Courier ပို့တာတွေ မလုပ်ပါဘူး။ Functional / Non-functional Requirements တွေကို `docs/REQUIREMENTS_AND_TEST_CASES.md` မှာ ဖတ်နိုင်ပါတယ်။

**Experience Edition အသစ်:** Homepage, Collection နဲ့ Spotlight မှာ Floating Tech Icons, Smooth Parallax, Glow/Scroll Animations တွေပါပြီး `assets/css/experience.css` နဲ့ `assets/js/experience.js` မှာ ပြင်နိုင်ပါတယ်။ Authentication မပါပါဘူး။


## Final version: Project launch / stop
- **SF Tech Store** = `http://127.0.0.1:8765/` (ဒီ Project အတွက် သီးသန့် port)
- ZIP ကိုအရင် Extract လုပ်ပါ။ Extract လုပ်ထားတဲ့ folder ထဲက `START_WINDOWS.bat` ကိုပဲ Run ပါ။
- Server run နေတဲ့ Command Prompt window ကို ဖွင့်ထားပါ။ `Ctrl+C` နှိပ်ခြင်း၊ အဲဒီ window ကို ပိတ်ခြင်းဖြင့် Server ကိုရပ်နိုင်ပါတယ်။
- အရင် version က `cmd /k` server သီးခြား run နေသေးရင် အဲဒီ window ကိုလည်းပိတ်ရပါမယ်။
- Port busy ဖြစ်ရင် Python error ကိုမြင်ရပါမယ်။ Browser tab ဟောင်းကို Refresh လုပ်ရုံနဲ့ Project server မပြောင်းပါ။
- Browser မှာ project URL (`:8765`) နဲ့ page title ကို စစ်ဆေးပါ။
