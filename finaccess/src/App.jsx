import { useState, useRef, useEffect, useCallback } from "react";

const I18N = {
  en: { appName:"SahaAI", role_user:"Customer", role_bank:"Bank Officer", tabs:{dashboard:"Dashboard",credit:"Credit Engine",risk:"Risk Forecast",products:"Products",rl:"Repayment History",finn:"Guardrails"}, bankTabs:{overview:"Overview",applicants:"Applicants",portfolio:"Portfolio",fairness:"Fairness Check",workflow:"Approvals"}, creditScore:"Credit Score", monthlyIncome:"Monthly Income", monthlyExpenses:"Monthly Expenses", financialRisk:"Financial Risk", repaymentHistory:"Repayment History (12 months)", liveSimulation:"Adjust Your Profile", aiAdvisor:"AI Assistant", shapTitle:"What affects your score", hurts:"← Lowers score", helps:"Raises score →", fairnessTitle:"Fairness Check", dataInputs:"Profile Inputs", riskTrend:"12-Month Risk Trend", riskDrivers:"Risk Drivers", nextMonth:"Next Month Prediction", distressProb:"Chance of financial stress", getActionPlan:"Show Next Steps ↗", products_title:"Matched Products", eligibility:"Eligibility match", explainElig:"Explain eligibility ↗", rlTitle:"Repayment History — Journey", stateSpace:"Profile Snapshot", rewardFn:"Reward Signals", finnsTitle:"Guardrails — Safety Rules", finnVsML:"Guardrails vs Model-Only", lossComponents:"Decision Rules", explainFinn:"Explain guardrails ↗", live:"Live", aiQuestions:["How can I improve my credit score?","Am I at risk of financial distress?","Which loan product fits me best?"], totalApplicants:"Total Applicants", activeLoans:"Active Loans", avgScore:"Avg Credit Score", portfolioRisk:"Portfolio Risk", approveBtn:"Approve", flagBtn:"Flag", rejectBtn:"Reject", applicantList:"Applicant Queue", batchUpload:"Batch Score Upload", fairnessAudit:"Bias Detection Across Groups", approvalWorkflow:"Approval Workflow",
    voiceTap:"Tap to Speak", voiceListening:"Listening…", voiceSpeak:"Reading aloud…", voiceBtn:"Tap & Ask", voiceStop:"Stop", voiceHint:"Tap the mic — ask your question in your language" },
  hi: { appName:"SahaAI", role_user:"ग्राहक", role_bank:"बैंक अधिकारी", tabs:{dashboard:"डैशबोर्ड",credit:"क्रेडिट इंजन",risk:"जोखिम",products:"उत्पाद",rl:"RL एजेंट",finn:"FINNs"}, bankTabs:{overview:"अवलोकन",applicants:"आवेदक",portfolio:"पोर्टफोलियो",fairness:"निष्पक्षता",workflow:"अनुमोदन"}, creditScore:"क्रेडिट स्कोर", monthlyIncome:"मासिक आय", monthlyExpenses:"मासिक खर्च", financialRisk:"वित्तीय जोखिम", repaymentHistory:"भुगतान इतिहास", liveSimulation:"लाइव सिमुलेशन", aiAdvisor:"AI सलाहकार", shapTitle:"XGBoost स्कोर — SHAP", hurts:"← घटाता है", helps:"बढ़ाता है →", fairnessTitle:"निष्पक्षता", dataInputs:"डेटा", riskTrend:"12-महीने जोखिम", riskDrivers:"जोखिम कारण", nextMonth:"अगले महीने", distressProb:"वित्तीय संकट की संभावना", getActionPlan:"AI योजना ↗", products_title:"मिलान उत्पाद", eligibility:"पात्रता", explainElig:"पात्रता समझाएं ↗", rlTitle:"RL एजेंट", stateSpace:"स्थिति", rewardFn:"पुरस्कार", finnsTitle:"FINNs बाधाएं", finnVsML:"FINNs बनाम ML", lossComponents:"लॉस फ़ंक्शन", explainFinn:"FINNs समझाएं ↗", live:"लाइव", aiQuestions:["मेरा क्रेडिट स्कोर कैसे सुधारें?","क्या मुझे वित्तीय संकट का खतरा है?","मेरे लिए कौन सा लोन सही है?"], totalApplicants:"कुल आवेदक", activeLoans:"सक्रिय ऋण", avgScore:"औसत स्कोर", portfolioRisk:"जोखिम", approveBtn:"स्वीकृत", flagBtn:"चिह्नित", rejectBtn:"अस्वीकृत", applicantList:"आवेदक कतार", batchUpload:"बैच अपलोड", fairnessAudit:"पूर्वाग्रह पहचान", approvalWorkflow:"अनुमोदन",
    voiceTap:"बोलने के लिए दबाएं", voiceListening:"सुन रहा हूं…", voiceSpeak:"पढ़ रहा हूं…", voiceBtn:"बोलकर पूछें", voiceStop:"रोकें", voiceHint:"माइक दबाएं — अपनी भाषा में पूछें" },
  ta: { appName:"SahaAI", role_user:"வாடிக்கையாளர்", role_bank:"வங்கி அதிகாரி", tabs:{dashboard:"டாஷ்போர்டு",credit:"கடன் இயந்திரம்",risk:"இடர்",products:"தயாரிப்புகள்",rl:"RL முகவர்",finn:"FINNs"}, bankTabs:{overview:"கண்ணோட்டம்",applicants:"விண்ணப்பதாரர்கள்",portfolio:"போர்ட்ஃபோலியோ",fairness:"நியாயம்",workflow:"அனுமதிகள்"}, creditScore:"கடன் மதிப்பெண்", monthlyIncome:"மாத வருமானம்", monthlyExpenses:"மாத செலவுகள்", financialRisk:"நிதி இடர்", repaymentHistory:"செலுத்தல் வரலாறு", liveSimulation:"நேரடி உருவகம்", aiAdvisor:"AI ஆலோசகர்", shapTitle:"XGBoost மதிப்பெண் — SHAP", hurts:"← குறைக்கிறது", helps:"அதிகரிக்கிறது →", fairnessTitle:"நியாயத்தன்மை", dataInputs:"தரவு", riskTrend:"12 மாத இடர்", riskDrivers:"இடர் காரணிகள்", nextMonth:"அடுத்த மாதம்", distressProb:"நிதி நெருக்கடி நிகழ்தகவு", getActionPlan:"AI திட்டம் ↗", products_title:"பொருந்திய தயாரிப்புகள்", eligibility:"தகுதி", explainElig:"தகுதி விளக்கம் ↗", rlTitle:"RL முகவர்", stateSpace:"நிலை இடம்", rewardFn:"வெகுமதி", finnsTitle:"FINNs தடைகள்", finnVsML:"FINNs மற்றும் ML", lossComponents:"இழப்பு செயல்பாடு", explainFinn:"FINNs விளக்கு ↗", live:"நேரடி", aiQuestions:["என் மதிப்பெண்ணை மேம்படுத்த என்ன செய்ய வேண்டும்?","என்னிடம் நிதி நெருக்கடி அபாயம் உள்ளதா?","எனக்கு எந்த கடன் சிறந்தது?"], totalApplicants:"மொத்த விண்ணப்பதாரர்கள்", activeLoans:"செயல்படும் கடன்கள்", avgScore:"சராசரி மதிப்பெண்", portfolioRisk:"இடர்", approveBtn:"அனுமதி", flagBtn:"கொடியிடு", rejectBtn:"நிராகரி", applicantList:"வரிசை", batchUpload:"தொகுதி பதிவேற்றம்", fairnessAudit:"சார்பு கண்டறிதல்", approvalWorkflow:"அனுமதி பணிப்பாய்வு",
    voiceTap:"பேச தட்டவும்", voiceListening:"கேட்கிறேன்…", voiceSpeak:"படிக்கிறேன்…", voiceBtn:"குரலில் கேளுங்கள்", voiceStop:"நிறுத்து", voiceHint:"மைக்கை தட்டி — உங்கள் மொழியில் கேளுங்கள்" },
  te: { appName:"SahaAI", role_user:"వినియోగదారు", role_bank:"బ్యాంక్ అధికారి", tabs:{dashboard:"డ్యాష్‌బోర్డ్",credit:"క్రెడిట్ ఇంజిన్",risk:"రిస్క్",products:"ఉత్పత్తులు",rl:"RL ఏజెంట్",finn:"FINNs"}, bankTabs:{overview:"అవలోకనం",applicants:"దరఖాస్తుదారులు",portfolio:"పోర్ట్‌ఫోలియో",fairness:"న్యాయం",workflow:"ఆమోదాలు"}, creditScore:"క్రెడిట్ స్కోర్", monthlyIncome:"నెలవారీ ఆదాయం", monthlyExpenses:"నెలవారీ ఖర్చులు", financialRisk:"ఆర్థిక ప్రమాదం", repaymentHistory:"చెల్లింపు చరిత్ర", liveSimulation:"లైవ్ సిమ్యులేషన్", aiAdvisor:"AI సలహాదారు", shapTitle:"XGBoost స్కోర్ — SHAP", hurts:"← తగ్గిస్తుంది", helps:"పెంచుతుంది →", fairnessTitle:"న్యాయం", dataInputs:"డేటా", riskTrend:"12-నెలల రిస్క్", riskDrivers:"రిస్క్ కారణాలు", nextMonth:"తదుపరి నెల", distressProb:"ఆర్థిక సంక్షోభ సంభావ్యత", getActionPlan:"AI ప్రణాళిక ↗", products_title:"సరిపోలిన ఉత్పత్తులు", eligibility:"అర్హత", explainElig:"అర్హత వివరించు ↗", rlTitle:"RL ఏజెంట్", stateSpace:"స్టేట్ స్పేస్", rewardFn:"రివార్డ్", finnsTitle:"FINNs పరిమితులు", finnVsML:"FINNs vs ML", lossComponents:"లాస్ ఫంక్షన్", explainFinn:"FINNs వివరించు ↗", live:"లైవ్", aiQuestions:["నా స్కోర్ మెరుగుపరచడానికి ఏమి చేయాలి?","నాకు ఆర్థిక సంక్షోభం ప్రమాదం ఉందా?","నాకు ఏ రుణం అనుకూలమైనది?"], totalApplicants:"మొత్తం దరఖాస్తుదారులు", activeLoans:"క్రియాశీల రుణాలు", avgScore:"సగటు స్కోర్", portfolioRisk:"రిస్క్", approveBtn:"ఆమోదించు", flagBtn:"ఫ్లాగ్", rejectBtn:"తిరస్కరించు", applicantList:"క్యూ", batchUpload:"బ్యాచ్ అప్‌లోడ్", fairnessAudit:"పక్షపాత గుర్తింపు", approvalWorkflow:"ఆమోద వర్క్‌ఫ్లో",
    voiceTap:"మాట్లాడటానికి నొక్కండి", voiceListening:"వింటున్నాను…", voiceSpeak:"చదువుతున్నాను…", voiceBtn:"గళంతో అడగండి", voiceStop:"ఆపు", voiceHint:"మైక్ నొక్కి — మీ భాషలో అడగండి" },
  bn: { appName:"SahaAI", role_user:"গ্রাহক", role_bank:"ব্যাংক কর্মকর্তা", tabs:{dashboard:"ড্যাশবোর্ড",credit:"ক্রেডিট ইঞ্জিন",risk:"ঝুঁকি",products:"পণ্য",rl:"RL এজেন্ট",finn:"FINNs"}, bankTabs:{overview:"সংক্ষিপ্ত",applicants:"আবেদনকারীরা",portfolio:"পোর্টফোলিও",fairness:"ন্যায়বিচার",workflow:"অনুমোদন"}, creditScore:"ক্রেডিট স্কোর", monthlyIncome:"মাসিক আয়", monthlyExpenses:"মাসিক ব্যয়", financialRisk:"আর্থিক ঝুঁকি", repaymentHistory:"পরিশোধের ইতিহাস", liveSimulation:"লাইভ সিমুলেশন", aiAdvisor:"AI উপদেষ্টা", shapTitle:"XGBoost স্কোর — SHAP", hurts:"← কমায়", helps:"বাড়ায় →", fairnessTitle:"ন্যায়বিচার", dataInputs:"ডেটা", riskTrend:"১২ মাসের ঝুঁকি", riskDrivers:"ঝুঁকির কারণ", nextMonth:"পরের মাস", distressProb:"আর্থিক সংকটের সম্ভাবনা", getActionPlan:"AI পরিকল্পনা ↗", products_title:"মিলে যাওয়া পণ্য", eligibility:"যোগ্যতা", explainElig:"যোগ্যতা ব্যাখ্যা ↗", rlTitle:"RL এজেন্ট", stateSpace:"স্টেট স্পেস", rewardFn:"রিওয়ার্ড", finnsTitle:"FINNs সীমাবদ্ধতা", finnVsML:"FINNs বনাম ML", lossComponents:"লস ফাংশন", explainFinn:"FINNs ব্যাখ্যা ↗", live:"লাইভ", aiQuestions:["ক্রেডিট স্কোর উন্নত করতে কী করব?","আমি কি আর্থিক সংকটের ঝুঁকিতে?","কোন ঋণ পণ্য সবচেয়ে ভালো?"], totalApplicants:"মোট আবেদনকারী", activeLoans:"সক্রিয় ঋণ", avgScore:"গড় স্কোর", portfolioRisk:"ঝুঁকি", approveBtn:"অনুমোদন", flagBtn:"ফ্ল্যাগ", rejectBtn:"প্রত্যাখ্যান", applicantList:"আবেদনকারীর সারি", batchUpload:"ব্যাচ আপলোড", fairnessAudit:"পক্ষপাত সনাক্তকরণ", approvalWorkflow:"অনুমোদন ওয়ার্কফ্লো",
    voiceTap:"কথা বলতে চাপুন", voiceListening:"শুনছি…", voiceSpeak:"পড়ছি…", voiceBtn:"কণ্ঠে জিজ্ঞেস করুন", voiceStop:"থামুন", voiceHint:"মাইক চাপুন — আপনার ভাষায় জিজ্ঞেস করুন" },
  kn: { appName:"SahaAI", role_user:"ಗ್ರಾಹಕ", role_bank:"ಬ್ಯಾಂಕ್ ಅಧಿಕಾರಿ", tabs:{dashboard:"ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",credit:"ಕ್ರೆಡಿಟ್ ಎಂಜಿನ್",risk:"ರಿಸ್ಕ್",products:"ಉತ್ಪನ್ನಗಳು",rl:"RL ಏಜೆಂಟ್",finn:"FINNs"}, bankTabs:{overview:"ಅವಲೋಕನ",applicants:"ಅರ್ಜಿದಾರರು",portfolio:"ಪೋರ್ಟ್‌ಫೋಲಿಯೋ",fairness:"ನ್ಯಾಯ",workflow:"ಅನುಮೋದನೆ"}, creditScore:"ಕ್ರೆಡಿಟ್ ಸ್ಕೋರ್", monthlyIncome:"ಮಾಸಿಕ ಆದಾಯ", monthlyExpenses:"ಮಾಸಿಕ ವೆಚ್ಚ", financialRisk:"ಆರ್ಥಿಕ ಅಪಾಯ", repaymentHistory:"ಮರುಪಾವತಿ ಇತಿಹಾಸ", liveSimulation:"ಲೈವ್ ಸಿಮ್ಯುಲೇಶನ್", aiAdvisor:"AI ಸಲಹೆಗಾರ", shapTitle:"XGBoost ಸ್ಕೋರ್ — SHAP", hurts:"← ಕಡಿಮೆ", helps:"ಹೆಚ್ಚು →", fairnessTitle:"ನ್ಯಾಯ", dataInputs:"ಡೇಟಾ", riskTrend:"12 ತಿಂಗಳ ರಿಸ್ಕ್", riskDrivers:"ರಿಸ್ಕ್ ಕಾರಣಗಳು", nextMonth:"ಮುಂದಿನ ತಿಂಗಳ", distressProb:"ಆರ್ಥಿಕ ಸಂಕಟ ಸಂಭಾವ್ಯತೆ", getActionPlan:"AI ಯೋಜನೆ ↗", products_title:"ಹೊಂದಿಸಿದ ಉತ್ಪನ್ನಗಳು", eligibility:"ಅರ್ಹತೆ", explainElig:"ಅರ್ಹತೆ ವಿವರಿಸಿ ↗", rlTitle:"RL ಏಜೆಂಟ್", stateSpace:"ಸ್ಟೇಟ್ ಸ್ಪೇಸ್", rewardFn:"ರಿವಾರ್ಡ್", finnsTitle:"FINNs ನಿರ್ಬಂಧಗಳು", finnVsML:"FINNs vs ML", lossComponents:"ಲಾಸ್ ಫಂಕ್ಷನ್", explainFinn:"FINNs ವಿವರಿಸಿ ↗", live:"ಲೈವ್", aiQuestions:["ನನ್ನ ಸ್ಕೋರ್ ಸುಧಾರಿಸಲು ಏನು ಮಾಡಬೇಕು?","ನನಗೆ ಆರ್ಥಿಕ ಸಂಕಟ ಅಪಾಯ ಇದೆಯೇ?","ಯಾವ ಸಾಲ ಸೂಕ್ತ?"], totalApplicants:"ಒಟ್ಟು ಅರ್ಜಿದಾರರು", activeLoans:"ಸಕ್ರಿಯ ಸಾಲಗಳು", avgScore:"ಸರಾಸರಿ ಸ್ಕೋರ್", portfolioRisk:"ರಿಸ್ಕ್", approveBtn:"ಅನುಮೋದಿಸಿ", flagBtn:"ಫ್ಲ್ಯಾಗ್", rejectBtn:"ತಿರಸ್ಕರಿಸಿ", applicantList:"ಸರದಿ", batchUpload:"ಬ್ಯಾಚ್ ಅಪ್‌ಲೋಡ್", fairnessAudit:"ಪಕ್ಷಪಾತ ಪತ್ತೆ", approvalWorkflow:"ಅನುಮೋದನ ವರ್ಕ್‌ಫ್ಲೋ",
    voiceTap:"ಮಾತನಾಡಲು ಒತ್ತಿ", voiceListening:"ಕೇಳುತ್ತಿದ್ದೇನೆ…", voiceSpeak:"ಓದುತ್ತಿದ್ದೇನೆ…", voiceBtn:"ಧ್ವನಿಯಲ್ಲಿ ಕೇಳಿ", voiceStop:"ನಿಲ್ಲಿಸಿ", voiceHint:"ಮೈಕ್ ಒತ್ತಿ — ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ ಕೇಳಿ" },
  mr: { appName:"SahaAI", role_user:"ग्राहक", role_bank:"बँक अधिकारी", tabs:{dashboard:"डॅशबोर्ड",credit:"क्रेडिट इंजिन",risk:"जोखीम",products:"उत्पादने",rl:"RL एजंट",finn:"FINNs"}, bankTabs:{overview:"आढावा",applicants:"अर्जदार",portfolio:"पोर्टफोलिओ",fairness:"निष्पक्षता",workflow:"मंजुरी"}, creditScore:"क्रेडिट स्कोअर", monthlyIncome:"मासिक उत्पन्न", monthlyExpenses:"मासिक खर्च", financialRisk:"आर्थिक जोखीम", repaymentHistory:"परतफेड इतिहास", liveSimulation:"लाइव्ह सिम्युलेशन", aiAdvisor:"AI सल्लागार", shapTitle:"XGBoost स्कोअर — SHAP", hurts:"← कमी करते", helps:"वाढवते →", fairnessTitle:"निष्पक्षता", dataInputs:"डेटा", riskTrend:"12-महिने जोखीम", riskDrivers:"जोखीम कारणे", nextMonth:"पुढील महिना", distressProb:"आर्थिक संकटाची शक्यता", getActionPlan:"AI योजना ↗", products_title:"जुळलेली उत्पादने", eligibility:"पात्रता", explainElig:"पात्रता समजावा ↗", rlTitle:"RL एजंट", stateSpace:"स्टेट स्पेस", rewardFn:"रिवॉर्ड", finnsTitle:"FINNs बंधने", finnVsML:"FINNs vs ML", lossComponents:"लॉस फंक्शन", explainFinn:"FINNs समजावा ↗", live:"लाइव्ह", aiQuestions:["माझा स्कोअर कसा सुधारावा?","मला आर्थिक संकटाचा धोका आहे का?","कोणती कर्ज योजना योग्य?"], totalApplicants:"एकूण अर्जदार", activeLoans:"सक्रिय कर्जे", avgScore:"सरासरी स्कोअर", portfolioRisk:"जोखीम", approveBtn:"मंजूर", flagBtn:"ध्वज", rejectBtn:"नाकारा", applicantList:"अर्जदार रांग", batchUpload:"बॅच अपलोड", fairnessAudit:"पूर्वग्रह शोध", approvalWorkflow:"मंजुरी वर्कफ्लो",
    voiceTap:"बोलण्यासाठी दाबा", voiceListening:"ऐकत आहे…", voiceSpeak:"वाचत आहे…", voiceBtn:"आवाजाने विचारा", voiceStop:"थांबा", voiceHint:"मायक दाबा — तुमच्या भाषेत प्रश्न विचारा" },
};

const LANGS=[
  {code:"en",label:"EN",name:"English",speechCode:"en-IN"},
  {code:"hi",label:"हि",name:"Hindi",speechCode:"hi-IN"},
  {code:"ta",label:"த",name:"Tamil",speechCode:"ta-IN"},
  {code:"te",label:"తె",name:"Telugu",speechCode:"te-IN"},
  {code:"bn",label:"বা",name:"Bengali",speechCode:"bn-IN"},
  {code:"kn",label:"ಕ",name:"Kannada",speechCode:"kn-IN"},
  {code:"mr",label:"म",name:"Marathi",speechCode:"mr-IN"}
];

const T={bg:"#f5f7fb",card:"#ffffff",cardAlt:"#f9fbff",border:"#d8e0ea",gold:"#c9982b",teal:"#0f9f8e",red:"#d95757",blue:"#2f6fde",purple:"#7b6cff",text:"#162033",muted:"#5e6b7d",dim:"#edf2f8"};
const RISK_HISTORY=[{month:"Apr",risk:22,income:29000,expense:19000},{month:"May",risk:28,income:26000,expense:22000},{month:"Jun",risk:18,income:34000,expense:18500},{month:"Jul",risk:35,income:24000,expense:23000},{month:"Aug",risk:42,income:22000,expense:24000},{month:"Sep",risk:30,income:31000,expense:20000},{month:"Oct",risk:25,income:33000,expense:19500},{month:"Nov",risk:38,income:27000,expense:22000},{month:"Dec",risk:20,income:36000,expense:18000},{month:"Jan",risk:24,income:35000,expense:19000},{month:"Feb",risk:29,income:31000,expense:21000},{month:"Mar",risk:33,income:32000,expense:21000}];
const SHAP_FEATURES=[{name:"Income volatility",value:-0.18,impact:"negative"},{name:"Repayment consistency",value:+0.31,impact:"positive"},{name:"Savings rate",value:+0.14,impact:"positive"},{name:"Expense ratio",value:-0.09,impact:"negative"},{name:"Existing loans",value:-0.07,impact:"negative"},{name:"Income level",value:+0.12,impact:"positive"}];
const PRODUCTS=[{id:1,type:"Micro Loan",name:"PM SVANidhi",amount:"₹50,000",rate:"7%",term:"12 mo",eligibility:85,tag:"Govt. Backed",desc:"Street vendor & gig worker micro-credit",color:T.teal},{id:2,type:"Personal Loan",name:"Jan Samarth",amount:"₹1,50,000",rate:"10.5%",term:"24 mo",eligibility:72,tag:"Recommended",desc:"National credit guarantee scheme",color:T.blue},{id:3,type:"Insurance",name:"PM Jeevan Jyoti",amount:"₹2,00,000",rate:"₹436/yr",term:"Annual",eligibility:95,tag:"Best Match",desc:"Life insurance for informal sector",color:T.gold},{id:4,type:"Subsidy",name:"MUDRA Yojana",amount:"₹3,00,000",rate:"8.5%",term:"36 mo",eligibility:61,tag:"Requires Docs",desc:"Micro-unit development loan",color:T.red}];
const RL_EPS=[{ep:1,reward:-1,action:"Skipped",score:620},{ep:2,reward:-1,action:"Skipped",score:608},{ep:3,reward:1,action:"On-time",score:625},{ep:4,reward:1,action:"On-time",score:641},{ep:5,reward:1,action:"On-time",score:656},{ep:6,reward:0.5,action:"Partial",score:659},{ep:7,reward:1,action:"On-time",score:671},{ep:8,reward:1,action:"On-time",score:682}];
const FINN_C=[{rule:"Expenditure ≤ 90% of income",status:"pass",actual:"65.6%",threshold:"< 90%"},{rule:"Debt-to-income ratio ≤ 40%",status:"pass",actual:"18.2%",threshold:"< 40%"},{rule:"Minimum 3 months income saved",status:"warn",actual:"1.5 mo",threshold:"≥ 3 mo"},{rule:"Repayment rate ≥ 70%",status:"pass",actual:"75%",threshold:"≥ 70%"},{rule:"Zero income → zero credit",status:"pass",actual:"N/A",threshold:"Hard rule"},{rule:"No debt service if income = 0",status:"pass",actual:"N/A",threshold:"Hard rule"}];
const INIT_APPLICANTS=[{id:"AP001",name:"Priya Sharma",score:714,risk:18,income:45000,product:"Personal Loan",status:"pending",source:"Salaried"},{id:"AP002",name:"Raju Verma",score:589,risk:52,income:18000,product:"Micro Loan",status:"flagged",source:"Gig"},{id:"AP003",name:"Meena Devi",score:651,risk:33,income:27000,product:"MUDRA",status:"pending",source:"Self-employed"},{id:"AP004",name:"Karthik R.",score:731,risk:15,income:62000,product:"Personal Loan",status:"approved",source:"Salaried"},{id:"AP005",name:"Fatima B.",score:603,risk:44,income:22000,product:"Micro Loan",status:"pending",source:"Gig"},{id:"AP006",name:"Suresh P.",score:678,risk:27,income:38000,product:"MUDRA",status:"pending",source:"Business"}];

// ─── VOICE ENGINE HOOK ────────────────────────────────────────────────────────
function useVoiceEngine(lang) {
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef(null);
  const langObj = LANGS.find(l => l.code === lang) || LANGS[0];

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSupported(!!(SR && window.speechSynthesis));
  }, []);

  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = langObj.speechCode;
    utt.rate = 0.88; utt.pitch = 1.05;
    const voices = window.speechSynthesis.getVoices();
    const match = voices.find(v => v.lang.startsWith(langObj.speechCode.split("-")[0]));
    if (match) utt.voice = match;
    utt.onstart = () => setSpeaking(true);
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utt);
  }, [langObj]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  const startListening = useCallback((onResult) => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    stopSpeaking();
    const rec = new SR();
    recognitionRef.current = rec;
    rec.lang = langObj.speechCode;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    rec.onstart = () => { setListening(true); setTranscript(""); };
    rec.onresult = (e) => {
      const t = Array.from(e.results).map(r => r[0].transcript).join("");
      setTranscript(t);
      if (e.results[e.results.length - 1].isFinal) onResult(t);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    rec.start();
  }, [langObj, stopSpeaking]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  return { listening, speaking, transcript, supported, speak, stopSpeaking, startListening, stopListening };
}

// ─── WAVEFORM BARS ────────────────────────────────────────────────────────────
function WaveformBars({ active, color, count = 7 }) {
  if (!active) return null;
  const heights = [2,3,5,4,5,3,2].slice(0, count);
  return (
    <span style={{ display:"inline-flex", gap:2, alignItems:"center", height:18 }}>
      {heights.map((h, i) => (
        <span key={i} style={{
          display:"inline-block", width:3, borderRadius:2, background:color,
          height: h*3, animation:`finWave ${0.55+i*0.06}s ease-in-out infinite alternate`,
          animationDelay:`${i*0.07}s`
        }}/>
      ))}
      <style>{`@keyframes finWave{from{transform:scaleY(.3)}to{transform:scaleY(1)}}`}</style>
    </span>
  );
}

// ─── BIG VOICE MIC BUTTON ─────────────────────────────────────────────────────
function VoiceMicButton({ voiceEngine, onResult, t, accentColor = T.teal, size = 80 }) {
  const { listening, speaking, transcript, supported, startListening, stopListening, stopSpeaking } = voiceEngine;
  if (!supported) return (
    <div style={{textAlign:"center",fontSize:11,color:T.muted,padding:"8px 0"}}>
      Voice not supported in this browser. Try Chrome on Android or desktop.
    </div>
  );
  const active = listening || speaking;
  const color = listening ? accentColor : speaking ? T.gold : T.muted;

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
      <div style={{ fontSize:11, color:T.muted, textAlign:"center", maxWidth:220, lineHeight:1.5 }}>{t.voiceHint}</div>
      <button
        onClick={() => { if(speaking) stopSpeaking(); else if(listening) stopListening(); else startListening(onResult); }}
        style={{
          width:size, height:size, borderRadius:"50%", cursor:"pointer",
          background: listening ? `radial-gradient(circle,${accentColor}33,${accentColor}11)`
            : speaking ? `radial-gradient(circle,${T.gold}33,${T.gold}11)` : T.dim,
          border:`2.5px solid ${color}`,
          display:"flex", alignItems:"center", justifyContent:"center",
          position:"relative", transition:"all .2s",
          boxShadow: active ? `0 0 0 8px ${color}18,0 0 0 18px ${color}08` : "none",
        }}
      >
        {active && [0,1].map(i=>(
          <span key={i} style={{
            position:"absolute", inset:0, borderRadius:"50%",
            border:`2px solid ${color}`, opacity:.5,
            animation:`micPulse 1.3s ease-out infinite`, animationDelay:`${i*0.45}s`
          }}/>
        ))}
        <svg width={size*0.42} height={size*0.42} viewBox="0 0 24 24" fill="none">
          <rect x="8" y="2" width="8" height="13" rx="4"
            fill={speaking ? T.gold : listening ? accentColor : "none"}
            stroke={color} strokeWidth="2"/>
          <path d="M5 10a7 7 0 0 0 14 0" stroke={color} strokeWidth="2" strokeLinecap="round"/>
          <line x1="12" y1="17" x2="12" y2="21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
          <line x1="9" y1="21" x2="15" y2="21" stroke={color} strokeWidth="2" strokeLinecap="round"/>
        </svg>
        <style>{`@keyframes micPulse{0%{transform:scale(1);opacity:.5}100%{transform:scale(1.75);opacity:0}}`}</style>
      </button>
      <div style={{fontSize:13,fontWeight:600,color,minHeight:20,display:"flex",alignItems:"center",gap:6}}>
        {active && <WaveformBars active color={color}/>}
        {listening ? t.voiceListening : speaking ? t.voiceSpeak : t.voiceTap}
      </div>
      {transcript && (
        <div style={{
          fontSize:12, color:T.text, background:T.dim, borderRadius:8,
          padding:"6px 14px", maxWidth:260, textAlign:"center", fontStyle:"italic",
          border:`1px solid ${accentColor}44`
        }}>
          "{transcript}"
        </div>
      )}
    </div>
  );
}

// ─── INLINE SPEAK BUTTON ─────────────────────────────────────────────────────
function SpeakButton({ text, voiceEngine, t }) {
  const { speaking, speak, stopSpeaking, supported } = voiceEngine;
  if (!supported || !text) return null;
  return (
    <button onClick={() => speaking ? stopSpeaking() : speak(text)}
      style={{
        display:"inline-flex", alignItems:"center", gap:6,
        background: speaking ? T.gold+"22" : T.dim,
        border:`1px solid ${speaking ? T.gold : T.border}`,
        borderRadius:20, padding:"4px 12px", cursor:"pointer",
        color: speaking ? T.gold : T.muted, fontSize:11, transition:"all .15s"
      }}>
      {speaking ? <><WaveformBars active color={T.gold}/>{t.voiceStop}</> : <>🔊 {t.voiceSpeak.replace("…","")}</>}
    </button>
  );
}

// ─── UTILITY COMPONENTS ───────────────────────────────────────────────────────
function SparkLine({data,color=T.teal,width=120,height=36}){
  const max=Math.max(...data),min=Math.min(...data),range=max-min||1;
  const pts=data.map((v,i)=>{const x=(i/(data.length-1))*(width-4)+2,y=height-4-((v-min)/range)*(height-8);return`${x},${y}`;}).join(" ");
  return <svg width={width} height={height} style={{display:"block"}}><polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>{data.map((v,i)=>{const x=(i/(data.length-1))*(width-4)+2,y=height-4-((v-min)/range)*(height-8);return i===data.length-1?<circle key={i} cx={x} cy={y} r={3} fill={color}/>:null;})}</svg>;
}

function ScoreGauge({score}){
  const pct=(score-300)/600,angle=-140+pct*280,color=score<580?T.red:score<670?T.gold:T.teal,label=score<580?"Poor":score<670?"Fair":score<750?"Good":"Excellent";
  return <svg viewBox="0 0 200 120" width="100%" style={{maxWidth:220}}><path d="M 20 110 A 80 80 0 1 1 180 110" fill="none" stroke={T.border} strokeWidth="12" strokeLinecap="round"/><path d="M 20 110 A 80 80 0 1 1 180 110" fill="none" stroke={color} strokeWidth="12" strokeLinecap="round" strokeDasharray={`${pct*251} 251`}/><g transform={`rotate(${angle}, 100, 110)`}><line x1="100" y1="110" x2="100" y2="42" stroke={color} strokeWidth="2" strokeLinecap="round"/><circle cx="100" cy="110" r="5" fill={color}/></g><text x="100" y="95" textAnchor="middle" fill={color} style={{fontSize:28,fontWeight:700,fontFamily:"monospace"}}>{score}</text><text x="100" y="112" textAnchor="middle" fill={T.muted} style={{fontSize:11}}>{label}</text></svg>;
}

function ShapBar({feature,value,impact}){
  const color=impact==="positive"?T.teal:T.red,w=Math.abs(value)/0.35*130;
  return <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><div style={{width:140,fontSize:11,color:T.muted,textAlign:"right",flexShrink:0}}>{feature}</div><div style={{width:130,height:14,display:"flex",alignItems:"center",justifyContent:impact==="positive"?"flex-start":"flex-end"}}><div style={{width:w,height:10,borderRadius:3,background:color,opacity:.85}}/></div><div style={{fontSize:11,color,width:42}}>{value>0?"+":""}{value.toFixed(2)}</div></div>;
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [lang, setLang] = useState("en");
  const [entryView, setEntryView] = useState("chooser");
  const [role, setRole] = useState("user");
  const [tab, setTab] = useState("dashboard");
  const [bankTab, setBankTab] = useState("overview");
  const [income, setIncome] = useState(32000);
  const [expense, setExpense] = useState(21000);
  const [incomeProof, setIncomeProof] = useState({ fileName: "Salary_Slip_Apr_2026.pdf", source: "Salary slip", verified: true });
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [applicants, setApplicants] = useState(INIT_APPLICANTS);
  const [showLang, setShowLang] = useState(false);
  const [userAuth, setUserAuth] = useState({name:"Aarav Kumar",phone:"+91 98765 43210",otp:""});
  const [bankAuth, setBankAuth] = useState({institution:"State Bank - South Zone Branch",employeeId:"BK-2048",password:""});

  const t = I18N[lang];
  const expenseRatio = expense / Math.max(income, 1);
  const score = Math.max(300, Math.min(900, Math.round(750 - expenseRatio*200 + (income/1000)*2)));
  const riskPct = Math.round(expenseRatio * 60);
  const voiceEngine = useVoiceEngine(lang);

  // Auto-speak AI responses
  useEffect(() => {
    if (aiResponse && !aiLoading) voiceEngine.speak(aiResponse);
  }, [aiResponse, aiLoading]);

  // ─── MOCK AI RESPONSES (keyword-matched, multilingual) ───────────────────
  const MOCK_RESPONSES = {
    en: [
      { keys:["credit","score","improve","better","increase","raise"],
        fn:()=>`Your credit score is ${score} right now — ${score>=700?"that's quite good!":score>=640?"that's fair, but we can do better!":"let's work on improving it!"}. The best thing you can do is pay your loans and bills on time every single month — even one missed payment can hurt your score. Try to spend less than 70% of your income (₹${Math.round(income*0.7/1000)}k) on expenses so you have savings left over.` },
      { keys:["risk","distress","danger","worried","safe","problem","trouble"],
        fn:()=>`Your current financial risk is ${riskPct}% — ${riskPct>40?"⚠️ that's a bit high, so let's be careful":"✅ that's manageable, good job!"}. Your expenses are ₹${(expense/1000).toFixed(0)}k out of ₹${(income/1000).toFixed(0)}k income, which means you're spending ${Math.round(expenseRatio*100)}% of what you earn. Try to save at least ₹${Math.round(income*0.15/1000)*1000} every month as an emergency buffer.` },
      { keys:["loan","product","which","best","apply","mudra","svanidhi","samarth","jeevan"],
        fn:()=>`Based on your income of ₹${(income/1000).toFixed(0)}k and score of ${score}, the PM SVANidhi micro-loan at 7% interest looks like your best match — it has an 85% eligibility fit for you. If you need a larger amount, Jan Samarth at 10.5% is also a good option. I'd suggest starting with SVANidhi since it's government-backed and easier to get approved.` },
      { keys:["save","saving","savings","money","budget","spend","expenses"],
        fn:()=>`You're currently spending ₹${(expense/1000).toFixed(0)}k out of ₹${(income/1000).toFixed(0)}k — that's ${Math.round(expenseRatio*100)}% of your income. A healthy target is to keep expenses below 70% and save at least 10–15%. Try setting aside ₹${Math.round(income*0.1/1000)*1000} on the day your income arrives, before spending anything else.` },
      { keys:["finn","neural","model","ai","algorithm","machine","xgboost","shap"],
    fn:()=>`Our decision engine combines machine learning with hard financial guardrails. It can score risk from behavior, but it still blocks unsafe recommendations such as borrowing with zero income or taking on repayment terms that exceed policy thresholds.` },
      { keys:["repay","repayment","missed","payment","emi","late","default"],
        fn:()=>`Your repayment history shows 9 out of 12 months paid on time — that's decent but we can push it to 12/12! Missing even one EMI can drop your score by 30–50 points. If you're ever short on cash, call your bank before the due date — they can often give you a short extension without penalising your score.` },
      { keys:["income","salary","earn","earning","job","work","gig"],
        fn:()=>`Your registered monthly income is ₹${(income/1000).toFixed(0)}k. For gig and informal workers, income can be irregular — our model understands that and uses a 12-month average rather than penalising you for one bad month. Keeping digital records of your payments (UPI, bank transfers) helps build a stronger income profile over time.` },
    ],
    hi: [
      { keys:["credit","score","सुधार","बेहतर","बढ़ा","स्कोर"],
        fn:()=>`आपका क्रेडिट स्कोर अभी ${score} है। सबसे अच्छा तरीका यह है कि हर महीने समय पर अपना लोन और बिल चुकाएं — एक भी छूटा हुआ भुगतान आपका स्कोर कम कर सकता है। कोशिश करें कि अपनी आमदनी ₹${(income/1000).toFixed(0)}k में से ₹${Math.round(income*0.3/1000)}k बचाएं।` },
      { keys:["जोखिम","खतरा","संकट","risk","परेशान","सुरक्षित"],
        fn:()=>`आपका वित्तीय जोखिम ${riskPct}% है — ${riskPct>40?"यह थोड़ा ज़्यादा है, सावधान रहें":"यह ठीक है!"}। आप अपनी आमदनी का ${Math.round(expenseRatio*100)}% खर्च कर रहे हैं। हर महीने कम से कम ₹${Math.round(income*0.15/1000)*1000} बचाने की कोशिश करें।` },
      { keys:["लोन","कर्ज","product","उत्पाद","कौन","best","सबसे"],
        fn:()=>`आपकी आमदनी ₹${(income/1000).toFixed(0)}k और स्कोर ${score} के हिसाब से, PM SVANidhi माइक्रो लोन आपके लिए सबसे अच्छा है — यह सरकारी लोन है और 7% ब्याज पर मिलता है। आपकी 85% पात्रता है। बड़ी रकम के लिए Jan Samarth भी अच्छा विकल्प है।` },
      { keys:["बचत","save","पैसा","खर्च","budget"],
        fn:()=>`आप हर महीने ₹${(expense/1000).toFixed(0)}k खर्च कर रहे हैं — यह आपकी आमदनी का ${Math.round(expenseRatio*100)}% है। तनख्वाह आने के दिन ही ₹${Math.round(income*0.1/1000)*1000} अलग रख दें, बाकी सब के बाद। यह आदत आपको बड़ी मुसीबत से बचाएगी।` },
    ],
    ta: [
      { keys:["மதிப்பெண்","score","சிறந்த","அதிகரி","கடன்"],
        fn:()=>`உங்கள் கடன் மதிப்பெண் இப்போது ${score}. ஒவ்வொரு மாதமும் சரியான நேரத்தில் கடனை திருப்பிச் செலுத்துவது மிக முக்கியம். உங்கள் வருமானம் ₹${(income/1000).toFixed(0)}k இல் ₹${Math.round(income*0.3/1000)}k சேமிக்க முயற்சி செய்யுங்கள்.` },
      { keys:["இடர்","ஆபத்து","நெருக்கடி","risk","பிரச்சனை"],
        fn:()=>`உங்கள் நிதி இடர் ${riskPct}% — ${riskPct>40?"கொஞ்சம் அதிகமாக உள்ளது, கவனமாக இருங்கள்":"நல்ல நிலையில் உள்ளீர்கள்!"}. மாதந்தோறும் குறைந்தது ₹${Math.round(income*0.15/1000)*1000} சேமியுங்கள்.` },
      { keys:["கடன்","loan","தயாரிப்பு","product","எது","சிறந்தது"],
        fn:()=>`உங்கள் வருமானம் ₹${(income/1000).toFixed(0)}k மற்றும் மதிப்பெண் ${score} ஆகியவற்றின் அடிப்படையில், PM SVANidhi 7% வட்டியில் சிறந்த தேர்வு — 85% தகுதி உள்ளது. அரசு ஆதரவுள்ள இந்த கடன் எளிதாக கிடைக்கும்.` },
    ],
    te: [
      { keys:["స్కోర్","score","మెరుగు","పెంచు","క్రెడిట్"],
        fn:()=>`మీ క్రెడిట్ స్కోర్ ఇప్పుడు ${score}. ప్రతి నెలా సమయానికి రుణం చెల్లించడం అత్యంత ముఖ్యమైనది. మీ ఆదాయం ₹${(income/1000).toFixed(0)}k లో ₹${Math.round(income*0.3/1000)}k ఆదా చేయడానికి ప్రయత్నించండి.` },
      { keys:["రిస్క్","ప్రమాదం","సంక్షోభం","risk","సమస్య"],
        fn:()=>`మీ ఆర్థిక రిస్క్ ${riskPct}% — ${riskPct>40?"కొంచెం ఎక్కువగా ఉంది, జాగ్రత్తగా ఉండండి":"బాగుంది!"}. ప్రతి నెలా కనీసం ₹${Math.round(income*0.15/1000)*1000} ఆదా చేయండి.` },
      { keys:["రుణం","loan","ఉత్పత్తి","product","ఏది","మంచిది"],
        fn:()=>`మీ ఆదాయం ₹${(income/1000).toFixed(0)}k మరియు స్కోర్ ${score} ఆధారంగా, PM SVANidhi 7% వడ్డీతో మీకు అత్యంత అనుకూలమైనది — 85% అర్హత ఉంది. ప్రభుత్వ మద్దతు ఉన్న ఈ రుణం సులభంగా లభిస్తుంది.` },
    ],
    bn: [
      { keys:["স্কোর","score","উন্নত","বাড়া","ক্রেডিট"],
        fn:()=>`আপনার ক্রেডিট স্কোর এখন ${score}। প্রতি মাসে সময়মতো ঋণ পরিশোধ করা সবচেয়ে গুরুত্বপূর্ণ। আপনার আয় ₹${(income/1000).toFixed(0)}k থেকে ₹${Math.round(income*0.3/1000)}k সঞ্চয় করার চেষ্টা করুন।` },
      { keys:["ঝুঁকি","বিপদ","সংকট","risk","সমস্যা"],
        fn:()=>`আপনার আর্থিক ঝুঁকি ${riskPct}% — ${riskPct>40?"একটু বেশি, সতর্ক থাকুন":"ভালো অবস্থায় আছেন!"}। প্রতি মাসে কমপক্ষে ₹${Math.round(income*0.15/1000)*1000} সঞ্চয় করুন।` },
      { keys:["ঋণ","loan","পণ্য","product","কোন","সেরা"],
        fn:()=>`আপনার আয় ₹${(income/1000).toFixed(0)}k এবং স্কোর ${score} অনুযায়ী, PM SVANidhi ৭% সুদে সবচেয়ে ভালো বিকল্প — ৮৫% যোগ্যতা আছে। এটি সরকারি সহায়তাপ্রাপ্ত ঋণ।` },
    ],
    kn: [
      { keys:["ಸ್ಕೋರ್","score","ಸುಧಾರಿಸು","ಹೆಚ್ಚಿಸು","ಕ್ರೆಡಿಟ್"],
        fn:()=>`ನಿಮ್ಮ ಕ್ರೆಡಿಟ್ ಸ್ಕೋರ್ ಈಗ ${score}. ಪ್ರತಿ ತಿಂಗಳು ಸಮಯಕ್ಕೆ ಸಾಲ ಮರುಪಾವತಿ ಮಾಡುವುದು ಅತ್ಯಂತ ಮುಖ್ಯ. ₹${(income/1000).toFixed(0)}k ಆದಾಯದಲ್ಲಿ ₹${Math.round(income*0.3/1000)}k ಉಳಿತಾಯ ಮಾಡಲು ಪ್ರಯತ್ನಿಸಿ.` },
      { keys:["ರಿಸ್ಕ್","ಅಪಾಯ","ಸಂಕಟ","risk","ಸಮಸ್ಯೆ"],
        fn:()=>`ನಿಮ್ಮ ಆರ್ಥಿಕ ಅಪಾಯ ${riskPct}% — ${riskPct>40?"ಸ್ವಲ್ಪ ಹೆಚ್ಚಾಗಿದೆ, ಜಾಗರೂಕರಾಗಿರಿ":"ಒಳ್ಳೆಯದಿದೆ!"}. ಪ್ರತಿ ತಿಂಗಳು ಕನಿಷ್ಠ ₹${Math.round(income*0.15/1000)*1000} ಉಳಿತಾಯ ಮಾಡಿ.` },
      { keys:["ಸಾಲ","loan","ಉತ್ಪನ್ನ","product","ಯಾವ","ಸೂಕ್ತ"],
        fn:()=>`ನಿಮ್ಮ ₹${(income/1000).toFixed(0)}k ಆದಾಯ ಮತ್ತು ${score} ಸ್ಕೋರ್ ಆಧಾರದ ಮೇಲೆ, PM SVANidhi 7% ಬಡ್ಡಿಯಲ್ಲಿ ಉತ್ತಮ ಆಯ್ಕೆ — 85% ಅರ್ಹತೆ ಇದೆ. ಇದು ಸರ್ಕಾರ ಬೆಂಬಲಿತ ಸಾಲ.` },
    ],
    mr: [
      { keys:["स्कोअर","score","सुधार","वाढव","क्रेडिट"],
        fn:()=>`तुमचा क्रेडिट स्कोअर आत्ता ${score} आहे. दर महिन्याला वेळेवर कर्ज भरणे सर्वात महत्त्वाचे आहे. ₹${(income/1000).toFixed(0)}k उत्पन्नातून ₹${Math.round(income*0.3/1000)}k बचत करण्याचा प्रयत्न करा.` },
      { keys:["जोखीम","धोका","संकट","risk","समस्या"],
        fn:()=>`तुमची आर्थिक जोखीम ${riskPct}% आहे — ${riskPct>40?"हे जास्त आहे, काळजी घ्या":"हे ठीक आहे!"}. दर महिन्याला किमान ₹${Math.round(income*0.15/1000)*1000} बचत करा.` },
      { keys:["कर्ज","loan","उत्पाद","product","कोणता","योग्य"],
        fn:()=>`तुमचे ₹${(income/1000).toFixed(0)}k उत्पन्न आणि ${score} स्कोअर पाहता, PM SVANidhi 7% व्याजावर सर्वोत्तम पर्याय आहे — 85% पात्रता आहे. हे सरकारी कर्ज आहे आणि सहज मिळते.` },
    ],
  };

  const FALLBACK = {
    en: `I’m your SahaAI advisor. Current profile: income ₹${(income/1000).toFixed(0)}k, expenses ₹${(expense/1000).toFixed(0)}k, credit score ${score}, risk ${riskPct}%. Ask me about score improvement, loan fit, savings buffer, scheme eligibility, or short-term risk.`,
    hi: `मैं आपका SahaAI सलाहकार हूं! आपकी प्रोफाइल: आय ₹${(income/1000).toFixed(0)}k, खर्च ₹${(expense/1000).toFixed(0)}k, क्रेडिट स्कोर ${score}, जोखिम ${riskPct}%। मुझसे स्कोर, लोन, बचत, योजना पात्रता, या जोखिम के बारे में पूछें!`,
    ta: `நான் உங்கள் SahaAI ஆலோசகர்! உங்கள் விவரம்: வருமானம் ₹${(income/1000).toFixed(0)}k, செலவு ₹${(expense/1000).toFixed(0)}k, மதிப்பெண் ${score}, இடர் ${riskPct}%. மதிப்பெண் மேம்பாடு, கடன் பொருத்தம், சேமிப்பு, திட்ட தகுதி பற்றி கேளுங்கள்!`,
    te: `నేను మీ SahaAI సలహాదారుని! మీ వివరాలు: ఆదాయం ₹${(income/1000).toFixed(0)}k, ఖర్చులు ₹${(expense/1000).toFixed(0)}k, స్కోర్ ${score}, రిస్క్ ${riskPct}%. స్కోర్ మెరుగుదల, రుణ అనుకూలత, పొదుపు, పథకం అర్హత గురించి అడగండి!`,
    bn: `আমি আপনার SahaAI উপদেষ্টা! আপনার তথ্য: আয় ₹${(income/1000).toFixed(0)}k, ব্যয় ₹${(expense/1000).toFixed(0)}k, স্কোর ${score}, ঝুঁকি ${riskPct}%। স্কোর, ঋণ, সঞ্চয়, প্রকল্প যোগ্যতা, বা ঝুঁকি নিয়ে জিজ্ঞেস করুন!`,
    kn: `ನಾನು ನಿಮ್ಮ SahaAI ಸಲಹೆಗಾರ! ನಿಮ್ಮ ವಿವರ: ಆದಾಯ ₹${(income/1000).toFixed(0)}k, ವೆಚ್ಚ ₹${(expense/1000).toFixed(0)}k, ಸ್ಕೋರ್ ${score}, ರಿಸ್ಕ್ ${riskPct}%. ಸ್ಕೋರ್ ಸುಧಾರಣೆ, ಸಾಲ ಹೊಂದಿಕೆ, ಉಳಿತಾಯ, ಯೋಜನೆ ಅರ್ಹತೆ ಬಗ್ಗೆ ಕೇಳಿ!`,
    mr: `मी तुमचा SahaAI सल्लागार आहे! तुमची माहिती: उत्पन्न ₹${(income/1000).toFixed(0)}k, खर्च ₹${(expense/1000).toFixed(0)}k, स्कोअर ${score}, जोखीम ${riskPct}%. स्कोअर, कर्ज, बचत, योजना पात्रता किंवा जोखीम याबद्दल विचारा!`,
  };

  async function askAI(prompt) {
    setAiLoading(true); setAiResponse(""); voiceEngine.stopSpeaking();
    // Simulate a short thinking delay
    await new Promise(r => setTimeout(r, 900 + Math.random() * 600));
    const q = prompt.toLowerCase();
    const responses = MOCK_RESPONSES[lang] || MOCK_RESPONSES.en;
    const matched = responses.find(r => r.keys.some(k => q.includes(k)));
    setAiResponse(matched ? matched.fn() : (FALLBACK[lang] || FALLBACK.en));
    setAiLoading(false);
  }

  const card = {background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:22};
  const cardAlt = {background:T.cardAlt,border:`1px solid ${T.border}`,borderRadius:12,padding:22};
  const label = {fontSize:12,color:T.muted,textTransform:"uppercase",letterSpacing:1.2,marginBottom:6};
  const badge = {fontSize:12,padding:"4px 10px",borderRadius:20,fontWeight:600};
  const navBtn = a => ({padding:"8px 14px",borderRadius:8,border:"none",background:a?(role==="bank"?T.blue:T.gold):"transparent",color:a?"#07090f":T.muted,fontSize:13,fontWeight:a?700:500,cursor:"pointer"});
  const g2 = {display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))",gap:12};
  const sec = {padding:"16px 24px 32px",maxWidth:1400,width:"100%",margin:"0 auto"};
  const authInput = {width:"100%",background:T.dim,border:`1px solid ${T.border}`,borderRadius:10,padding:"12px 14px",color:T.text,fontSize:14,outline:"none"};
  const landingShell = {minHeight:"100vh",background:`radial-gradient(circle at top, ${T.cardAlt} 0%, ${T.bg} 45%)`,fontFamily:"'DM Sans',system-ui,sans-serif",color:T.text};

  const beginAuth = r => { setRole(r); setEntryView(r==="user"?"user-auth":"bank-auth"); setAiResponse(""); setShowLang(false); };
  const completeAuth = r => { setRole(r); setTab("dashboard"); setBankTab("overview"); setAiResponse(""); setEntryView("app"); };
  const signOut = () => { voiceEngine.stopSpeaking(); voiceEngine.stopListening(); setEntryView("chooser"); setAiResponse(""); setShowLang(false); };

  // ─── FULL AI ADVISOR BLOCK WITH VOICE ──────────────────────────────────────
  const AIAdvisorBlock = ({ accentColor = T.gold }) => (
    <div style={{...cardAlt, borderLeft:`3px solid ${accentColor}`, marginTop:12}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
        <div style={label}>{t.aiAdvisor}</div>
        {aiResponse && <SpeakButton text={aiResponse} voiceEngine={voiceEngine} t={t}/>}
      </div>

      {/* ── PRIMARY: BIG VOICE BUTTON ── */}
      <div style={{background:T.bg,borderRadius:12,padding:"16px",marginBottom:12,border:`1px solid ${accentColor}22`}}>
        <VoiceMicButton voiceEngine={voiceEngine} onResult={askAI} t={t} accentColor={accentColor} size={72}/>
      </div>

      {/* ── SECONDARY: preset chips ── */}
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
        <div style={{flex:1,height:1,background:T.border}}/>
        <span style={{fontSize:10,color:T.muted,whiteSpace:"nowrap"}}>or pick a question</span>
        <div style={{flex:1,height:1,background:T.border}}/>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
        {t.aiQuestions.map(q=>(
          <button key={q} onClick={()=>askAI(q)}
            style={{background:T.dim,border:`1px solid ${T.border}`,borderRadius:20,padding:"5px 12px",fontSize:11,color:T.text,cursor:"pointer",lineHeight:1.4}}>
            {q}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {aiLoading && (
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 0"}}>
          <WaveformBars active color={accentColor}/><span style={{fontSize:12,color:accentColor}}>Analysing…</span>
        </div>
      )}

      {/* Response */}
      {aiResponse && !aiLoading && (
        <div style={{background:T.dim,borderRadius:10,padding:"12px 14px",border:`1px solid ${accentColor}33`}}>
          <div style={{fontSize:13,lineHeight:1.8,color:T.text,marginBottom:8}}>{aiResponse}</div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <SpeakButton text={aiResponse} voiceEngine={voiceEngine} t={t}/>
            {voiceEngine.speaking && <WaveformBars active color={T.gold}/>}
          </div>
        </div>
      )}
    </div>
  );

  // ─── USER TABS ────────────────────────────────────────────────────────────
  const Dashboard = () => (
    <div style={sec}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))",gap:12,marginBottom:12}}>
        <div style={{...card,display:"flex",flexDirection:"column",alignItems:"center",padding:"14px 20px"}}><div style={label}>{t.creditScore}</div><ScoreGauge score={score}/></div>
        {[
          [t.monthlyIncome, `Verified ₹${(income/1000).toFixed(0)}k`, T.teal, RISK_HISTORY.map(d => d.income / 1000)],
          [t.monthlyExpenses, `₹${(expense/1000).toFixed(0)}k`, T.gold, RISK_HISTORY.map(d => d.expense / 1000)],
          [t.financialRisk, `${riskPct}%`, riskPct > 40 ? T.red : T.teal, RISK_HISTORY.map(d => d.risk)]
        ].map(([lbl, val, col, data]) => (
          <div key={lbl} style={card}><div style={label}>{lbl}</div><div style={{fontSize:32,fontWeight:700,fontFamily:"monospace",color:col}}>{val}</div><div style={{marginTop:12}}><SparkLine data={data} color={col}/></div></div>
        ))}
      </div>
      <div style={{...card,marginBottom:12}}>
        <div style={label}>{t.liveSimulation}</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))",gap:20,marginTop:10}}>
          <div style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:10,padding:14}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:14,color:T.muted,marginBottom:8}}>
              <span>{t.monthlyIncome}</span>
              <span style={{color:T.teal,fontFamily:"monospace",fontSize:15}}>Verified ₹{(income/1000).toFixed(0)}k</span>
            </div>
            <div style={{fontSize:12,color:T.muted,marginBottom:10}}>Upload a salary slip, bank statement, or ITR to verify monthly income.</div>
            <label style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,background:T.cardAlt,border:`1px dashed ${T.border}`,borderRadius:10,padding:"14px",cursor:"pointer",color:T.text,fontSize:13}}>
              <span>Attach proof document</span>
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                style={{display:"none"}}
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const lower = file.name.toLowerCase();
                  setIncomeProof({
                    fileName: file.name,
                    source: lower.includes("bank") ? "Bank statement" : lower.includes("itr") ? "ITR" : "Salary slip",
                    verified: true,
                  });
                }}
              />
            </label>
            <div style={{marginTop:10,fontSize:12,color:T.muted,display:"flex",justifyContent:"space-between",gap:10,flexWrap:"wrap"}}>
              <span>{incomeProof.fileName}</span>
              <span style={{color:T.teal,fontWeight:600}}>Verified via {incomeProof.source}</span>
            </div>
          </div>
          <div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:14,color:T.muted,marginBottom:8}}>
              <span>{t.monthlyExpenses}</span>
              <span style={{color:T.gold,fontFamily:"monospace",fontSize:15}}>₹{(expense/1000).toFixed(0)}k</span>
            </div>
            <input type="range" min={5000} max={70000} step={1000} value={expense} onChange={e=>setExpense(+e.target.value)} style={{width:"100%",accentColor:T.gold}}/>
          </div>
        </div>
      </div>
      <div style={{...card,marginBottom:12}}>
        <div style={label}>{t.repaymentHistory}</div>
        <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
          {[1,1,1,0,1,1,0,0,1,1,1,1].map((v,i)=><div key={i} style={{width:30,height:30,borderRadius:5,background:v?T.teal+"33":T.red+"33",border:`1px solid ${v?T.teal:T.red}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>{v?"✓":"✗"}</div>)}
          <div style={{marginLeft:10,alignSelf:"center",fontSize:11,color:T.muted}}>9/12</div>
        </div>
      </div>
      <AIAdvisorBlock accentColor={T.gold}/>
    </div>
  );

  const Credit = () => (
    <div style={sec}><div style={g2}>
      <div style={card}><div style={label}>{t.shapTitle}</div><div style={{marginTop:14}}><div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:T.muted,marginBottom:10}}><span>{t.hurts}</span><span>{t.helps}</span></div>{SHAP_FEATURES.map(f=><ShapBar key={f.name} {...f}/>)}</div><div style={{marginTop:12,paddingTop:10,borderTop:`1px solid ${T.border}`,fontSize:11,color:T.muted}}>Machine learning with simple explanations and fairness checks.</div></div>
      <div><div style={{...card,marginBottom:12}}><div style={label}>{t.fairnessTitle}</div>{[{group:"Gig workers",score:671},{group:"Salaried",score:710},{group:"Rural borrowers",score:648},{group:"Women borrowers",score:680}].map(g=><div key={g.group} style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:12}}>{g.group}</span><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{width:90,height:6,borderRadius:3,background:T.border,overflow:"hidden"}}><div style={{width:`${(g.score-300)/6}%`,height:"100%",background:g.score>680?T.teal:g.score>650?T.gold:T.red,borderRadius:3}}/></div><span style={{fontSize:11,fontFamily:"monospace",color:T.muted,width:32}}>{g.score}</span></div></div>)}</div>
      <div style={card}><div style={label}>{t.dataInputs}</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:8}}>{[["Source","Gig Worker"],["Volatility","31%"],["Savings","₹48k"],["Loans","1"],["Exp Ratio",`${((expense/income)*100).toFixed(0)}%`],["Repayment","75%"]].map(([k,v])=><div key={k} style={{background:T.dim,borderRadius:6,padding:"7px 10px"}}><div style={{fontSize:10,color:T.muted}}>{k}</div><div style={{fontSize:13,fontWeight:600,fontFamily:"monospace",color:T.text,marginTop:1}}>{v}</div></div>)}</div></div></div>
    </div>
    <AIAdvisorBlock accentColor={T.teal}/>
    </div>
  );

  const Risk = () => (
    <div style={sec}><div style={g2}>
      <div style={card}><div style={label}>{t.riskTrend}</div><div style={{marginTop:10}}>{RISK_HISTORY.map((d,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:5}}><span style={{fontSize:9,color:T.muted,width:24}}>{d.month}</span><div style={{flex:1,height:8,background:T.border,borderRadius:4,overflow:"hidden"}}><div style={{width:`${(d.risk/50)*100}%`,height:"100%",background:d.risk>40?T.red:d.risk>28?T.gold:T.teal,borderRadius:4}}/></div><span style={{fontSize:10,fontFamily:"monospace",color:d.risk>40?T.red:T.muted,width:26,textAlign:"right"}}>{d.risk}%</span></div>)}</div><div style={{marginTop:10,padding:"7px 10px",background:T.dim,borderRadius:6,fontSize:11,color:T.muted}}><span style={{color:T.gold}}>⚠ Threshold: 40%</span></div></div>
      <div><div style={{...card,marginBottom:12}}><div style={label}>{t.riskDrivers}</div>{[{d:"Income drop (Aug–Sep)",s:"high"},{d:"High expense-to-income",s:"medium"},{d:"Irregular repayments",s:"medium"},{d:"Low savings buffer",s:"high"}].map(r=><div key={r.d} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><span style={{fontSize:12}}>{r.d}</span><span style={{...badge,background:r.s==="high"?T.red+"22":T.gold+"22",color:r.s==="high"?T.red:T.gold}}>{r.s}</span></div>)}</div>
      <div style={card}><div style={label}>{t.nextMonth}</div><div style={{textAlign:"center",padding:"14px 0"}}><div style={{fontSize:38,fontWeight:700,fontFamily:"monospace",color:T.red}}>38%</div><div style={{fontSize:12,color:T.muted,marginTop:4}}>{t.distressProb}</div><button onClick={()=>askAI("My next-month financial risk is predicted at 38%. Give me a specific action plan.")} style={{marginTop:12,background:T.red+"22",border:`1px solid ${T.red}`,borderRadius:20,padding:"6px 16px",color:T.red,fontSize:11,cursor:"pointer"}}>{t.getActionPlan}</button></div></div></div>
    </div>
    <AIAdvisorBlock accentColor={T.red}/>
    </div>
  );

  const Products = () => (
    <div style={sec}><div style={{marginBottom:12,fontSize:12,color:T.muted}}>{t.products_title} · Score {score} · Risk {riskPct}%</div>
    <div style={g2}>{PRODUCTS.map(p=><div key={p.id} style={{...card,borderLeft:`3px solid ${p.color}`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}><div><div style={{fontSize:10,color:T.muted,textTransform:"uppercase",letterSpacing:1}}>{p.type}</div><div style={{fontSize:15,fontWeight:600,marginTop:1}}>{p.name}</div></div><span style={{...badge,background:p.color+"22",color:p.color}}>{p.tag}</span></div><div style={{fontSize:11,color:T.muted,marginBottom:12}}>{p.desc}</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:12}}>{[["Amount",p.amount],["Rate",p.rate],["Term",p.term]].map(([k,v])=><div key={k} style={{background:T.dim,borderRadius:5,padding:"5px 8px"}}><div style={{fontSize:9,color:T.muted}}>{k}</div><div style={{fontSize:11,fontWeight:600,fontFamily:"monospace",color:T.text}}>{v}</div></div>)}</div><div style={{marginBottom:8}}><div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:T.muted,marginBottom:3}}><span>{t.eligibility}</span><span style={{color:p.color,fontFamily:"monospace"}}>{p.eligibility}%</span></div><div style={{height:4,background:T.border,borderRadius:2,overflow:"hidden"}}><div style={{width:`${p.eligibility}%`,height:"100%",background:p.color,borderRadius:2}}/></div></div><button onClick={()=>askAI(`Should I apply for ${p.name}? My credit score is ${score} and income is ₹${income}.`)} style={{width:"100%",background:p.color+"11",border:`1px solid ${p.color}33`,borderRadius:6,padding:"7px",color:p.color,fontSize:11,cursor:"pointer"}}>{t.explainElig}</button></div>)}</div>
    <AIAdvisorBlock accentColor={T.gold}/>
    </div>
  );

  const RLAgent = () => (
    <div style={sec}><div style={g2}>
      <div style={card}><div style={label}>{t.rlTitle}</div><div style={{marginTop:12}}>{RL_EPS.map((ep,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,marginBottom:7,fontSize:12}}><span style={{color:T.muted,fontSize:10,width:24}}>E{ep.ep}</span><span style={{...badge,background:ep.reward===1?T.teal+"22":ep.reward===-1?T.red+"22":T.gold+"22",color:ep.reward===1?T.teal:ep.reward===-1?T.red:T.gold}}>{ep.action}</span><span style={{fontSize:10,color:T.muted}}>R:{ep.reward>0?"+":""}{ep.reward}</span><span style={{marginLeft:"auto",fontFamily:"monospace",fontSize:11}}>{ep.score}</span></div>)}</div></div>
      <div><div style={{...card,marginBottom:12}}><div style={label}>{t.stateSpace}</div>{[["Income",`₹${(income/1000).toFixed(0)}k`,T.teal],["Debt","₹5.8k",T.gold],["Savings","₹48k",T.blue],["Risk",`${riskPct}%`,T.red],["Score",`${score}`,T.purple]].map(([k,v,c])=><div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:7,padding:"5px 10px",background:T.dim,borderRadius:5}}><span style={{fontSize:12}}>{k}</span><span style={{fontSize:12,fontFamily:"monospace",color:c}}>{v}</span></div>)}</div>
      <div style={card}><div style={label}>{t.rewardFn}</div><div style={{padding:"10px 12px",background:T.dim,borderRadius:7,fontFamily:"monospace",fontSize:11,lineHeight:1.9}}><div><span style={{color:T.teal}}>+1.0</span> On-time repayment</div><div><span style={{color:T.gold}}>+0.5</span> Partial payment</div><div><span style={{color:T.red}}>−1.0</span> Missed payment</div><div><span style={{color:T.purple}}>+0.2</span> Score ≥ +10pts</div></div></div></div>
    </div></div>
  );

  const FINNs = () => (
    <div style={sec}><div style={g2}>
      <div style={card}><div style={label}>{t.finnsTitle}</div><div style={{fontSize:11,color:T.muted,marginBottom:12}}>These checks keep recommendations practical and safe for real borrowers.</div>{FINN_C.map((c,i)=><div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8,padding:"9px 12px",background:c.status==="warn"?T.gold+"10":T.dim,border:`1px solid ${c.status==="warn"?T.gold+"44":T.border}`,borderRadius:7}}><div style={{flex:1}}><div style={{fontSize:12}}>{c.rule}</div><div style={{fontSize:10,color:T.muted,marginTop:1}}>Current: <span style={{fontFamily:"monospace",color:c.status==="warn"?T.gold:T.text}}>{c.actual}</span> · Target: {c.threshold}</div></div><span style={{...badge,marginLeft:10,background:c.status==="warn"?T.gold+"22":T.teal+"22",color:c.status==="warn"?T.gold:T.teal}}>{c.status}</span></div>)}</div>
      <div><div style={{...card,marginBottom:12}}><div style={label}>{t.finnVsML}</div>{[{label:"Follows explicit rules",finn:true,ml:false},{label:"Blocks unsafe recommendations",finn:true,ml:false},{label:"Respects repayment limits",finn:true,ml:false},{label:"Learns from data",finn:true,ml:true},{label:"Handles unusual cases",finn:true,ml:false}].map(r=><div key={r.label} style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:7,padding:"5px 10px",background:T.dim,borderRadius:5}}><span style={{fontSize:12,flex:1}}>{r.label}</span><span style={{fontSize:11,color:r.finn?T.teal:T.red,fontFamily:"monospace",minWidth:50,textAlign:"center"}}>{r.finn?"✓ Yes":"✗ No"}</span><span style={{fontSize:11,color:r.ml?T.teal:T.red,fontFamily:"monospace",minWidth:38,textAlign:"center"}}>{r.ml?"✓ Yes":"✗ No"}</span></div>)}</div>
      <div style={card}><div style={label}>{t.lossComponents}</div><div style={{padding:"10px 12px",background:T.dim,borderRadius:7,fontFamily:"monospace",fontSize:11,lineHeight:2}}><div><span style={{color:T.gold}}>Recommendation score</span></div><div style={{paddingLeft:12}}>+ behavior signals + repayment history</div><div style={{paddingLeft:12}}>+ safety checks + policy limits</div><div style={{paddingLeft:12}}>+ fairness review for edge cases</div></div><button onClick={()=>askAI("How do guardrails make financial recommendations safer?")} style={{marginTop:10,width:"100%",background:T.gold+"11",border:`1px solid ${T.gold}33`,borderRadius:6,padding:"7px",color:T.gold,fontSize:11,cursor:"pointer"}}>{t.explainFinn}</button></div></div>
    </div>
    <AIAdvisorBlock accentColor={T.gold}/>
    </div>
  );

  // ─── BANK TABS ────────────────────────────────────────────────────────────
  const BankOverview = () => (
    <div style={sec}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(220px, 1fr))",gap:12,marginBottom:12}}>
        {[[t.totalApplicants,"2,847",T.blue,"↑ 12% this month"],[t.activeLoans,"1,203",T.teal,"₹18.4 Cr disbursed"],[t.avgScore,"664",T.gold,"Industry avg: 650"],[t.portfolioRisk,"31%",T.red,"⚠ 8% high-risk"]].map(([lbl,val,col,sub])=><div key={lbl} style={card}><div style={label}>{lbl}</div><div style={{fontSize:20,fontWeight:700,fontFamily:"monospace",color:col,marginBottom:3}}>{val}</div><div style={{fontSize:11,color:T.muted}}>{sub}</div></div>)}
      </div>
      <div style={{...card,marginBottom:12}}><div style={label}>Portfolio Risk Distribution</div><div style={{display:"flex",gap:2,height:20,borderRadius:4,overflow:"hidden",marginTop:10}}>{[{pct:42,c:T.teal,l:"Low"},{pct:35,c:T.gold,l:"Med"},{pct:15,c:"#f97316",l:"High"},{pct:8,c:T.red,l:"Crit"}].map(s=><div key={s.l} style={{width:`${s.pct}%`,background:s.c,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:"#07090f",fontWeight:700}}>{s.pct>10?s.pct+"%":""}</div>)}</div></div>
      <div style={card}><div style={label}>Recent Activity</div><div style={{marginTop:8}}>{applicants.slice(0,4).map(a=><div key={a.id} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 0",borderBottom:`1px solid ${T.border}`}}><span style={{fontSize:10,color:T.muted,fontFamily:"monospace",width:44}}>{a.id}</span><span style={{fontSize:13,flex:1}}>{a.name}</span><span style={{fontSize:12,fontFamily:"monospace",color:a.score>700?T.teal:a.score>640?T.gold:T.red,fontWeight:600}}>{a.score}</span><span style={{...badge,background:a.status==="approved"?T.teal+"22":a.status==="flagged"?T.red+"22":T.dim,color:a.status==="approved"?T.teal:a.status==="flagged"?T.red:T.muted}}>{a.status}</span></div>)}</div></div>
    </div>
  );

  const BankApplicants = () => (
    <div style={sec}>
      <div style={{...card,marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><div style={label}>{t.applicantList}</div><button onClick={()=>askAI("As a bank officer, how should I fairly evaluate a gig worker's loan application using AI scoring?")} style={{background:T.blue+"22",border:`1px solid ${T.blue}33`,borderRadius:20,padding:"5px 14px",color:T.blue,fontSize:11,cursor:"pointer"}}>AI Evaluation Guide ↗</button></div>
        {applicants.map(a=><div key={a.id} style={{padding:"12px 14px",marginBottom:8,background:a.status==="flagged"?T.red+"08":a.status==="approved"?T.teal+"08":T.dim,border:`1px solid ${a.status==="flagged"?T.red+"33":a.status==="approved"?T.teal+"33":T.border}`,borderRadius:8}}>
          <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
            <span style={{fontSize:10,color:T.muted,fontFamily:"monospace",width:44}}>{a.id}</span>
            <span style={{fontSize:14,fontWeight:600,flex:1,minWidth:100}}>{a.name}</span>
            <span style={{fontSize:11,color:T.muted}}>{a.source}</span>
            <span style={{fontSize:13,fontFamily:"monospace",color:a.score>700?T.teal:a.score>640?T.gold:T.red,fontWeight:600}}>{a.score}</span>
            <span style={{fontSize:11,color:a.risk>40?T.red:T.muted}}>Risk:{a.risk}%</span>
            {a.status==="pending"&&<>
              <button onClick={()=>setApplicants(p=>p.map(x=>x.id===a.id?{...x,status:"approved"}:x))} style={{background:T.teal+"22",border:`1px solid ${T.teal}44`,borderRadius:5,padding:"4px 10px",color:T.teal,fontSize:11,cursor:"pointer"}}>{t.approveBtn}</button>
              <button onClick={()=>setApplicants(p=>p.map(x=>x.id===a.id?{...x,status:"flagged"}:x))} style={{background:T.gold+"22",border:`1px solid ${T.gold}44`,borderRadius:5,padding:"4px 10px",color:T.gold,fontSize:11,cursor:"pointer"}}>{t.flagBtn}</button>
              <button onClick={()=>setApplicants(p=>p.map(x=>x.id===a.id?{...x,status:"rejected"}:x))} style={{background:T.red+"22",border:`1px solid ${T.red}44`,borderRadius:5,padding:"4px 10px",color:T.red,fontSize:11,cursor:"pointer"}}>{t.rejectBtn}</button>
            </>}
            {a.status!=="pending"&&<span style={{...badge,background:a.status==="approved"?T.teal+"22":a.status==="rejected"?T.red+"22":T.gold+"22",color:a.status==="approved"?T.teal:a.status==="rejected"?T.red:T.gold}}>{a.status}</span>}
          </div>
        </div>)}
      </div>
    </div>
  );

  const BankPortfolio = () => (
    <div style={sec}><div style={g2}>
      <div style={card}><div style={label}>Sector Breakdown</div>{[{sector:"Agriculture & Rural",amt:"₹4.2 Cr",pct:23,risk:28,color:T.teal},{sector:"Gig & Informal",amt:"₹3.8 Cr",pct:21,risk:44,color:T.gold},{sector:"Micro Enterprise",amt:"₹5.1 Cr",pct:28,risk:31,color:T.blue},{sector:"Salaried / Formal",amt:"₹5.3 Cr",pct:28,risk:14,color:T.purple}].map(s=><div key={s.sector} style={{marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between",fontSize:12,marginBottom:4}}><span>{s.sector}</span><span style={{fontFamily:"monospace",color:T.muted}}>{s.amt}</span></div><div style={{display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,height:8,background:T.border,borderRadius:4,overflow:"hidden"}}><div style={{width:`${s.pct*3.5}%`,height:"100%",background:s.color,borderRadius:4}}/></div><span style={{fontSize:10,color:s.risk>40?T.red:T.muted,minWidth:50,textAlign:"right"}}>Risk:{s.risk}%</span></div></div>)}</div>
      <div style={card}><div style={label}>Branch Network</div><div style={{fontSize:11,color:T.muted,marginBottom:10}}>Different city branches of the same bank.</div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:10}}>{[{bank:"Mumbai Branch",status:"active",rounds:142,color:T.teal},{bank:"Delhi Branch",status:"active",rounds:138,color:T.teal},{bank:"Bengaluru Branch",status:"review",rounds:135,color:T.gold},{bank:"Kolkata Branch",status:"pending",rounds:112,color:T.muted}].map(b=><div key={b.bank} style={{background:T.dim,borderRadius:8,padding:"10px 12px"}}><div style={{fontSize:11,fontWeight:600,marginBottom:4}}>{b.bank}</div><span style={{...badge,background:b.color+"22",color:b.color}}>{b.status}</span><div style={{fontSize:10,color:T.muted,marginTop:4}}>Cases:{b.rounds}</div></div>)}</div><div style={{marginTop:10,fontSize:11,color:T.muted}}>Portfolio coverage: <span style={{color:T.teal,fontFamily:"monospace"}}>87.3%</span></div></div>
    </div></div>
  );

  const BankFairness = () => (
    <div style={sec}><div style={g2}>
      <div style={card}><div style={label}>{t.fairnessAudit}</div>{[{group:"Gig workers",approved:62,avg_score:671,disparity:"+3%"},{group:"Agricultural workers",approved:54,avg_score:638,disparity:"-8%"},{group:"Women borrowers",approved:67,avg_score:680,disparity:"+7%"},{group:"Rural borrowers",approved:49,avg_score:642,disparity:"-12%"},{group:"SC/ST borrowers",approved:51,avg_score:645,disparity:"-10%"},{group:"Youth (18–25)",approved:58,avg_score:612,disparity:"-3%"}].map(g=><div key={g.group} style={{marginBottom:10,padding:"8px 12px",background:T.dim,borderRadius:7}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{fontSize:12,fontWeight:600}}>{g.group}</span><span style={{fontSize:11,fontFamily:"monospace",color:g.disparity.startsWith("-")?T.red:T.teal}}>{g.disparity} vs baseline</span></div><div style={{height:4,background:T.border,borderRadius:2,overflow:"hidden"}}><div style={{width:`${g.approved}%`,height:"100%",background:g.approved>60?T.teal:g.approved>52?T.gold:T.red,borderRadius:2}}/></div></div>)}</div>
      <div style={card}><div style={label}>Regulatory Compliance</div>{[["RBI Fair Practices Code","✓ Compliant",T.teal],["Equal Credit Opportunity","✓ Compliant",T.teal],["DPDP Act 2023","✓ Compliant",T.teal],["Algorithmic Transparency","⚠ Partial",T.gold]].map(([k,v,c])=><div key={k} style={{display:"flex",justifyContent:"space-between",marginBottom:7,fontSize:12}}><span style={{color:T.muted}}>{k}</span><span style={{color:c,fontWeight:600}}>{v}</span></div>)}</div>
    </div></div>
  );

  const BankWorkflow = () => (
    <div style={sec}><div style={g2}>
      <div style={card}><div style={label}>{t.approvalWorkflow}</div><div style={{marginTop:10}}>{[{stage:"AI Scoring",count:2847,color:T.blue,done:true},{stage:"Risk Check",count:2847,color:T.blue,done:true},{stage:"FINN Constraint Validation",count:2847,color:T.blue,done:true},{stage:"Officer Review",count:312,color:T.gold,done:false},{stage:"Final Approval",count:198,color:T.teal,done:false},{stage:"Disbursed",count:1203,color:T.teal,done:true}].map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}><div style={{width:32,height:32,borderRadius:"50%",background:s.done?s.color+"33":T.dim,border:`1px solid ${s.done?s.color:T.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:s.done?s.color:T.muted,fontWeight:600,flexShrink:0}}>{i+1}</div><div style={{flex:1}}><div style={{fontSize:12,fontWeight:600}}>{s.stage}</div><div style={{fontSize:10,color:T.muted}}>{s.count.toLocaleString()} applications</div></div><span style={{...badge,background:s.done?s.color+"22":T.dim,color:s.done?s.color:T.muted}}>{s.done?"done":"pending"}</span></div>)}</div></div>
      <div style={card}><div style={label}>Audit Trail</div>{[{time:"09:42",officer:"Priya K.",action:"Approved AP004"},{time:"09:31",officer:"Rajan M.",action:"Flagged AP002"},{time:"09:15",officer:"System",action:"Batch scored 312"},{time:"08:50",officer:"Priya K.",action:"Approved AP007"}].map((e,i)=><div key={i} style={{display:"flex",gap:10,marginBottom:7,padding:"5px 0",borderBottom:`1px solid ${T.border}`}}><span style={{fontSize:10,color:T.muted,fontFamily:"monospace",width:36}}>{e.time}</span><span style={{fontSize:11,flex:1}}>{e.action}</span><span style={{fontSize:10,color:T.muted}}>{e.officer}</span></div>)}</div>
    </div></div>
  );

  // ─── PORTAL CHOOSER ───────────────────────────────────────────────────────
  const renderPortalChooser = () => (
    <div style={landingShell}>
      <div style={{...sec,maxWidth:1240,paddingTop:48,paddingBottom:48}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24,gap:16,flexWrap:"wrap"}}>
          <div style={{flex:1,minWidth:280}}>
            <div style={{fontSize:13,letterSpacing:2,color:T.gold,textTransform:"uppercase",marginBottom:10}}>SahaAI</div>
            <div style={{fontSize:36,fontWeight:700,lineHeight:1.15,maxWidth:640,marginBottom:12}}>Real-world credit access for underserved borrowers and bank teams</div>
            <div style={{fontSize:15,color:T.muted,lineHeight:1.7,maxWidth:680}}>Built for gig workers, informal earners, and first-time borrowers. SahaAI uses behavioral financial data to assess risk, suggest suitable products, flag early distress, and surface government schemes.</div>
          </div>
          <button onClick={()=>setShowLang(m=>!m)} style={{background:T.dim,border:`1px solid ${T.border}`,borderRadius:10,padding:"10px 14px",color:T.text,fontSize:13,cursor:"pointer",flexShrink:0}}>{LANGS.find(l=>l.code===lang)?.label} ▾</button>
        </div>

        {showLang&&<div style={{display:"flex",justifyContent:"flex-end",marginBottom:20}}><div style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:12,minWidth:180,overflow:"hidden"}}>{LANGS.map(l=><button key={l.code} onClick={()=>{setLang(l.code);setShowLang(false);}} style={{display:"block",width:"100%",textAlign:"left",padding:"10px 14px",background:lang===l.code?T.dim:"transparent",border:"none",color:lang===l.code?T.text:T.muted,fontSize:13,cursor:"pointer"}}><span style={{marginRight:8,fontWeight:700}}>{l.label}</span>{l.name}</button>)}</div></div>}

        {/* Voice guidance banner */}
        <div style={{...cardAlt,marginBottom:20,borderLeft:`3px solid ${T.teal}`,display:"flex",gap:20,alignItems:"center",flexWrap:"wrap"}}>
          <div style={{flex:1,minWidth:200}}>
            <div style={{fontSize:14,fontWeight:700,color:T.teal,marginBottom:6}}>🎤 Voice-first support</div>
            <div style={{fontSize:13,color:T.muted,lineHeight:1.65}}>Speak in your preferred language and get spoken guidance back instantly. The same assistant also works for bank officers as a decision-support layer.</div>
          </div>
          <VoiceMicButton voiceEngine={voiceEngine} onResult={askAI} t={t} accentColor={T.teal} size={70}/>
        </div>

        {(aiResponse||aiLoading) && (
          <div style={{...cardAlt,marginBottom:16,borderLeft:`3px solid ${T.teal}`}}>
            {aiLoading
              ? <div style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:T.teal}}><WaveformBars active color={T.teal}/> Thinking…</div>
              : <div><div style={{fontSize:13,lineHeight:1.8}}>{aiResponse}</div><div style={{marginTop:8}}><SpeakButton text={aiResponse} voiceEngine={voiceEngine} t={t}/></div></div>
            }
          </div>
        )}

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))",gap:20}}>
          {[
            {accent:T.gold,emoji:"👤",role:"Customer Portal",title:"Borrow · Save · Build History",desc:"See your score, find the right product, estimate distress risk, and check eligibility for relevant schemes.",features:["🎤 Ask by voice, get spoken guidance","📊 Behavior-based credit dashboard","🛟 Early risk alerts and action steps"],label:"Enter Customer Portal →",fn:()=>beginAuth("user")},
            {accent:T.blue,emoji:"🏦",role:"Bank Portal",title:"Assess · Explain · Approve",desc:"Review applicants, monitor portfolio risk, audit fairness, and move cases through a traceable workflow.",features:["🔐 Officer credentials and access control","📋 Applicant review queue","⚖️ Fairness and compliance audit"],label:"Enter Bank Portal →",fn:()=>beginAuth("bank")}
          ].map(({accent,emoji,role,title,desc,features,label:btnLabel,fn})=>(
            <div key={role} style={{...cardAlt,border:`1px solid ${accent}44`,boxShadow:`inset 0 0 0 1px ${accent}22`,padding:28}}>
              <div style={{fontSize:13,letterSpacing:1.3,textTransform:"uppercase",color:accent,marginBottom:12}}>{emoji} {role}</div>
              <div style={{fontSize:26,fontWeight:700,marginBottom:10}}>{title}</div>
              <div style={{fontSize:14,color:T.muted,lineHeight:1.7,marginBottom:18}}>{desc}</div>
              <div style={{display:"grid",gap:8,marginBottom:22}}>
                {features.map(f=><div key={f} style={{fontSize:13,color:T.text,background:T.dim,borderRadius:10,padding:"10px 12px"}}>{f}</div>)}
              </div>
              <button onClick={fn} style={{background:accent,border:"none",borderRadius:10,padding:"13px 20px",color:"#07090f",fontSize:15,fontWeight:700,cursor:"pointer",width:"100%"}}>{btnLabel}</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAuthPage = (mode) => {
    const isUser = mode==="user";
    const accent = isUser ? T.gold : T.blue;
    const authState = isUser ? userAuth : bankAuth;
    const setAuthState = isUser ? setUserAuth : setBankAuth;
    return (
      <div style={landingShell}>
        <div style={{...sec,maxWidth:1120,paddingTop:48,paddingBottom:48}}>
          <button onClick={()=>setEntryView("chooser")} style={{background:"transparent",border:`1px solid ${T.border}`,borderRadius:999,padding:"8px 14px",color:T.muted,fontSize:13,cursor:"pointer",marginBottom:22}}>← Back</button>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(340px, 1fr))",gap:24}}>
            <div style={{...cardAlt,border:`1px solid ${accent}44`,padding:28,display:"flex",flexDirection:"column",gap:16}}>
              <div style={{fontSize:13,letterSpacing:1.3,textTransform:"uppercase",color:accent}}>{isUser?"Customer Authentication":"Bank Authentication"}</div>
              <div style={{fontSize:28,fontWeight:700,lineHeight:1.2}}>{isUser?"Access your financial profile":"Secure officer workspace"}</div>
              <div style={{fontSize:14,color:T.muted,lineHeight:1.7}}>{isUser?"Use voice or typed details to open your profile. This is designed to feel like a real consumer onboarding flow, not a prototype.":"Authenticate with institution credentials to view applications, portfolio health, and fairness reporting."}</div>
              {voiceEngine.supported && (
                <div style={{borderTop:`1px solid ${T.border}`,paddingTop:14}}>
                  <VoiceMicButton voiceEngine={voiceEngine} onResult={askAI} t={t} accentColor={accent} size={64}/>
                </div>
              )}
            </div>
            <div style={{...card,display:"grid",gap:16,alignContent:"start"}}>
              <div style={{fontSize:20,fontWeight:700}}>{isUser?"Sign in":"Officer sign in"}</div>
              {isUser?<>
                <div><div style={{fontSize:13,color:T.muted,marginBottom:8}}>Full name</div><input value={authState.name} onChange={e=>setAuthState(v=>({...v,name:e.target.value}))} style={authInput}/></div>
                <div><div style={{fontSize:13,color:T.muted,marginBottom:8}}>Mobile number</div><input value={authState.phone} onChange={e=>setAuthState(v=>({...v,phone:e.target.value}))} style={authInput}/></div>
                <div><div style={{fontSize:13,color:T.muted,marginBottom:8}}>OTP</div><input value={authState.otp} onChange={e=>setAuthState(v=>({...v,otp:e.target.value}))} style={authInput} placeholder="Enter verification code"/></div>
              </>:<>
                <div><div style={{fontSize:13,color:T.muted,marginBottom:8}}>Institution</div><input value={authState.institution} onChange={e=>setAuthState(v=>({...v,institution:e.target.value}))} style={authInput}/></div>
                <div><div style={{fontSize:13,color:T.muted,marginBottom:8}}>Employee ID</div><input value={authState.employeeId} onChange={e=>setAuthState(v=>({...v,employeeId:e.target.value}))} style={authInput}/></div>
                <div><div style={{fontSize:13,color:T.muted,marginBottom:8}}>Password</div><input type="password" value={authState.password} onChange={e=>setAuthState(v=>({...v,password:e.target.value}))} style={authInput}/></div>
              </>}
              <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                <button onClick={()=>completeAuth(mode)} style={{background:accent,border:"none",borderRadius:10,padding:"12px 20px",color:"#07090f",fontSize:15,fontWeight:700,cursor:"pointer"}}>{isUser?"Open Customer Dashboard":"Open Bank Workspace"}</button>
                <button onClick={()=>setEntryView("chooser")} style={{background:"transparent",border:`1px solid ${T.border}`,borderRadius:10,padding:"12px 20px",color:T.text,fontSize:14,cursor:"pointer"}}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if(entryView==="chooser") return renderPortalChooser();
  if(entryView==="user-auth") return renderAuthPage("user");
  if(entryView==="bank-auth") return renderAuthPage("bank");

  const renderUser = () => ({dashboard:<Dashboard/>,credit:<Credit/>,risk:<Risk/>,products:<Products/>,rl:<RLAgent/>,finn:<FINNs/>}[tab]||<Dashboard/>);
  const renderBank = () => ({overview:<BankOverview/>,applicants:<BankApplicants/>,portfolio:<BankPortfolio/>,fairness:<BankFairness/>,workflow:<BankWorkflow/>}[bankTab]||<BankOverview/>);

  return (
    <div style={{minHeight:"100vh",background:T.bg,fontFamily:"'DM Sans',system-ui,sans-serif",color:T.text}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap');*{box-sizing:border-box;margin:0;padding:0;}input[type=range]{height:4px;cursor:pointer;}button{font-family:inherit;}`}</style>

      {/* ─── HEADER ─── */}
      <div style={{background:T.card,borderBottom:`1px solid ${T.border}`,padding:"0 14px",display:"flex",alignItems:"center",gap:8,height:60,flexWrap:"wrap"}}>
        <div style={{fontSize:16,fontWeight:700,color:role==="bank"?T.blue:T.gold,fontFamily:"monospace",letterSpacing:1,flexShrink:0}}>◈ {t.appName}</div>
        <div style={{width:1,height:16,background:T.border,flexShrink:0}}/>
        <span style={{fontSize:11,padding:"4px 9px",borderRadius:20,background:role==="bank"?T.blue+"22":T.gold+"22",color:role==="bank"?T.blue:T.gold,fontWeight:600,flexShrink:0}}>{role==="bank"?t.role_bank:t.role_user}</span>

        {/* ─── PERSISTENT VOICE BUTTON IN HEADER ─── */}
        {voiceEngine.supported && (
          <button
            onClick={()=>{ if(voiceEngine.speaking) voiceEngine.stopSpeaking(); else if(voiceEngine.listening) voiceEngine.stopListening(); else voiceEngine.startListening(askAI); }}
            title={t.voiceHint}
            style={{
              display:"flex",alignItems:"center",gap:5,padding:"5px 11px",borderRadius:20,cursor:"pointer",transition:"all .15s",flexShrink:0,
              background:voiceEngine.listening?T.teal+"22":voiceEngine.speaking?T.gold+"22":T.dim,
              border:`1px solid ${voiceEngine.listening?T.teal:voiceEngine.speaking?T.gold:T.border}`,
            }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect x="8" y="2" width="8" height="13" rx="4"
                fill={voiceEngine.listening?T.teal:voiceEngine.speaking?T.gold:"none"}
                stroke={voiceEngine.listening?T.teal:voiceEngine.speaking?T.gold:T.muted} strokeWidth="2"/>
              <path d="M5 10a7 7 0 0 0 14 0" stroke={voiceEngine.listening?T.teal:voiceEngine.speaking?T.gold:T.muted} strokeWidth="2" strokeLinecap="round"/>
              <line x1="12" y1="17" x2="12" y2="21" stroke={voiceEngine.listening?T.teal:voiceEngine.speaking?T.gold:T.muted} strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <WaveformBars active={voiceEngine.listening||voiceEngine.speaking} color={voiceEngine.listening?T.teal:T.gold}/>
            <span style={{fontSize:11,color:voiceEngine.listening?T.teal:voiceEngine.speaking?T.gold:T.muted,display:"none"}}>
              {voiceEngine.listening?t.voiceListening:voiceEngine.speaking?t.voiceSpeak:t.voiceBtn}
            </span>
          </button>
        )}

        <button onClick={signOut} style={{background:"transparent",border:`1px solid ${T.border}`,borderRadius:20,padding:"4px 10px",color:T.muted,fontSize:11,cursor:"pointer",flexShrink:0}}>← Back</button>
        <div style={{flex:1,minWidth:4}}/>
        <nav style={{display:"flex",gap:2,flexWrap:"wrap"}}>
          {role==="user"
            ? Object.entries(t.tabs).map(([id,lbl])=><button key={id} style={navBtn(tab===id)} onClick={()=>{setTab(id);setAiResponse("");voiceEngine.stopSpeaking();}}>{lbl}</button>)
            : Object.entries(t.bankTabs).map(([id,lbl])=><button key={id} style={navBtn(bankTab===id)} onClick={()=>setBankTab(id)}>{lbl}</button>)
          }
        </nav>
        <div style={{position:"relative",flexShrink:0}}>
          <button onClick={()=>setShowLang(m=>!m)} style={{background:T.dim,border:`1px solid ${T.border}`,borderRadius:6,padding:"5px 9px",color:T.text,fontSize:12,cursor:"pointer"}}>{LANGS.find(l=>l.code===lang)?.label} ▾</button>
          {showLang&&<div style={{position:"absolute",right:0,top:32,background:T.card,border:`1px solid ${T.border}`,borderRadius:8,zIndex:100,minWidth:130,overflow:"hidden"}}>
            {LANGS.map(l=><button key={l.code} onClick={()=>{setLang(l.code);setShowLang(false);}} style={{display:"block",width:"100%",textAlign:"left",padding:"10px 14px",background:lang===l.code?T.dim:"transparent",border:"none",color:lang===l.code?T.text:T.muted,fontSize:13,cursor:"pointer"}}><span style={{marginRight:8,fontWeight:700}}>{l.label}</span>{l.name}</button>)}
          </div>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0}}><span style={{width:6,height:6,borderRadius:"50%",background:T.teal,display:"inline-block"}}/><span style={{fontSize:11,color:T.muted}}>{t.live}</span></div>
      </div>

      {role==="user" ? renderUser() : renderBank()}
    </div>
  );
}
