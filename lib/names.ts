// Name dictionary for a mostly Pakistani audience typing in Roman Urdu.
// Spelling variants are matched loosely in validateName.ts, so one common spelling per name is enough.

const MALE = `
muhammad mohammad ahmad ahmed ali hassan hasan hussain husain hasnain hussnain usman umar omar abubakar bakar
bilal hamza zain zaid zeeshan zeshan faisal imran kamran adnan farhan rizwan irfan salman sulaiman suleman noman
nouman nauman arslan arsalan asad saad fahad fawad junaid waqas waqar zubair tariq khalid shahid zahid sajid majid
wajid abid asif atif arif nasir qasim kashif rashid abdullah abdul rehman rahman rahim karim aslam akram akbar
asghar azhar anwar afzal iqbal javed jawad jawwad jamal kamal naveed waseem nadeem naeem saleem shamim tahir talha
taha yasir yasin yaseen younas yousaf yusuf yunus idrees ilyas ismail ibrahim ishaq yaqoob haris hammad hamid hamad
haider hyder danish daniyal dawood ehsan ehtisham ahtisham faraz fazal furqan ghulam habib hafeez haseeb hashim
ijaz ejaz imtiaz inam iftikhar jahangir jibran jabbar kaleem kaiser qaiser khurram luqman mansoor masood mehmood
mahmood mohsin mubashir mudassar mudasir mujahid mukhtar munir murad murtaza mustafa muzammil nabeel nawaz nazir
nisar owais uwais awais qadir qadeer qamar rafiq rafay rafi rameez raza rauf sabir sadiq saeed safdar sajjad sameer
samir sarfraz shafiq shahbaz shahzad shehzad shakeel shakir sharjeel shoaib sohail suhail subhan sufyan taimoor
taimur tanveer tanvir tauseef touseef tayyab umair usama osama wahab wali waleed waris yahya zafar zaheer zakir zia
zulfiqar aamir amir ameer ammar anas aneeb aqib arham ashar ashfaq ashraf ayaan ayan azeem azam babar badar basit
burhan ebad faizan faiz farooq faheem ghazanfar hafiz hanif hannan haroon harun ibad ikram imad kabir kashan khizar
maaz moaz mueez muneeb musa moosa mutahir nadir najam najeeb noor rahat rayyan rehan riaz sabeeh sadaqat saif sami
sarmad shan shayan shehryar shaheryar sheraz shiraz sikandar siraj sultan talal tanzeel uzair wajahat wasif yawar
zaki zameer zohaib zuhaib zulqarnain abrar adeel adil afaq ahsan aqeel arshad asim ateeq aun bashir dilawar fakhar
farrukh feroz ghafoor gul hameed hasham ibrar ihsan inzamam irshad jameel kamil khawar liaqat maqsood masroor mazhar
mehboob mehtab mubeen mumtaz mushtaq naseer naseem obaid ubaid parvez pervaiz qayyum raheel saqib sarwar shafqat
shaukat siddique sohaib suhaib tabish tufail umer wahid waheed zahoor zaman anees sharif latif sher jan nawab mir
abdulrehman abdulrahman abdulbasit abdulhadi hadi rohail sohaib raees rais zahir zeeshan fahim ahad samad sameed
sabih shams shahab shahryar shehroz shahroz taimur daud dawar ayub ayoob idris ismael adeel ayaz aziz baqir bashar
fayyaz ghani hanzala huzaifa hozaifa ilyas intizar israr jalal jalil kazim khayyam maqbool masud mateen moin muhib
mujtaba munawar mursaleen naqash nasrullah nauroz qudrat rafaqat rahmat rasheed razzaq sadiq saifullah salah
samiullah sanaullah shafi shahid sibtain tahseen tauqeer ulfat wasim yameen zakariya zeb zubair zulfi
`;

const FEMALE = `
ayesha aisha fatima zainab maryam mariam khadija amna hira sana sara saba iqra aqsa anam anum rabia sadia saima
samina shazia nazia nadia rubina farah faiza fiza hina huma uzma asma asia bushra maria mehwish mahnoor mahira maham
mehak laiba alina aleena eman iman esha isha hafsa kinza komal kiran madiha mahwish momina nimra noreen nosheen rida
ramsha rimsha rukhsar saira sajida samreen sehar sehrish sidra sobia sumaira sumera tahira tayyaba tooba urooj warda
wajiha yasmin zara zahra zoya zunaira arooj areeba arfa arisha ayat azka benish dua erum fariha farzana hadia haleema
hamna hania humaira ifra inaya irum javeria kanwal khansa lubna maheen malaika manahil maira mehreen minahil misbah
mubashra muqaddas mishal nabila naila najma naheed nargis nasreen nausheen nida nighat parveen qurat quratulain
rafia raheela rehana rizwana romana rukhsana sabeen sabiha sadaf safia sahar sajal salma samra sanam shabana
shagufta shaista shamsa shehla shumaila shireen shabnam sofia sonia sughra sumbal sundas tabassum tahmina tania
tehmina umama unaiza yumna zakia zarish zobia zubaida zulekha aiman alishba anaya anabia fizza hoorain inshal irha
kashaf mahrukh manal marwa mehr mehrunisa momal nayab rania rameen sameen samia sania shiza tehreem urwa wania zonia
amber ambreen afshan asifa atiya azra bilqees farhat fauzia fozia gulnaz ishrat kausar kulsoom kalsoom musarrat
nasira nazish riffat rashida razia saeeda safina seema shahida shakila surayya tasneem zeenat zohra huda hoor aleeza
aliza anmol ayla eshal hareem jannat kainat laraib mahnaz mahjabeen meerab mirha noorulain rija sabahat sawera sehr
sumayya tabinda uswa yusra zahida zaib zeba zubia amina aneesa arwa bano begum bibi daneen fareeha ghazala hajra
hamida iffat jamila khalida laila lalarukh maliha mehnaz mumtaz nabiha nafeesa noorjahan rehmat saadia sabira
samiya shaheen shamaila sitara sohaila taiba ulfat zakiya zareen zartaj
`;

// Surnames, tribes, castes and titles common in Pakistan.
const FAMILY = `
khan malik butt bhatti chaudhry chaudhary choudhry chaudhri rana rajput raja mirza sheikh shaikh syed sayed sayyid
shah bukhari gillani gilani jilani naqvi rizvi zaidi jafri jafferi kazmi abidi hashmi qureshi siddiqui farooqui
usmani ansari awan abbasi alvi arain jatt jat jutt gujjar warraich cheema bajwa sandhu gondal tarar virk sahi chattha
ghuman randhawa sidhu dogar khokhar janjua minhas kiani kayani satti niazi khattak afridi yousafzai yusufzai marwat
bangash durrani lodhi tareen kakar achakzai baloch bugti marri mengal rind jamali magsi lashari leghari mazari khosa
soomro junejo jatoi bhutto zardari talpur memon mirani pirzada makhdoom hussaini gardezi qadri chishti sabri pathan
khawaja khwaja kashmiri dar lone wani bhat pasha beg baig mughal chughtai barlas gill nagra mann sial sipra tiwana
noon hiraj khakwani qazi kazi mian pir sardar kamboh maher mahar chandio abro shar dahar rao sukhera wattoo joiya
kharal hanjra dhillon bhutta khichi langah masih sahibzada nawabzada hafiz qari maulana mufti dr engr prof mr mrs
miss ms sahib advocate
`;

// A small set of common international names.
const INTERNATIONAL = `
john david michael james robert william sarah emma olivia sophia anna daniel adam joseph thomas peter paul mark
george jack harry charlie oliver noah liam lucas mia emily grace chloe lily amelia isabella jessica jennifer linda
susan lisa kevin brian jason ryan eric steven andrew alex alexander samuel benjamin christopher matthew nicholas
jonathan patrick richard charles edward henry victor simon martin mary elizabeth catherine rachel rebecca laura
hannah julia nina sophie kate amy zoe ella ava leo max sam ben tom tim dan joe ravi raj anil sunil kumar sanjay
vijay amit deepak krishna ram lal das meena pooja priya sunita asher
`;

// Everyday English and Roman Urdu words people type instead of a name.
export const COMMON_WORDS = `
hello hi hey test testing name first last full user admin guest someone somebody nobody none null nothing no yes
okay ok abc xyz asdf qwerty password pakistan india lahore karachi islamabad rawalpindi faisalabad multan peshawar
quetta punjab sindh apple banana mango orange table chair computer laptop mobile phone cricket football game love
hate cat dog pizza burger boy girl man woman king queen boss bro brother sister friend dude buddy baby sweet cute
happy sad good bad cool nice random fake real unknown anonymous secret private public who what why where when how
the and you me my your mine his her our they them this that here there come go see look please thanks thank sorry
welcome world earth sun moon star sky water fire air book pen car bike house home school college university office
work job money cash business scaalus google facebook instagram whatsapp youtube tiktok america usa english urdu
mera meri mere naam mai main mein hum tum aap ap ye yeh wo woh kya kyun kyu kaise kahan kab koi kuch kuchh nahi nai
nhi nahin haan han ji jee acha achha accha theek thik bhai bhaijan behen baji yaar yar dost pagal paagal gadha ullu
bewakoof kutta kamina kameena chal jao aja ajao khana pani chai roti doodh ghar dil pyar pyaar ishq janu jaanu shona
babu tera teri mujhe tujhe batao pata malum maloom sab log larka larki banda bandi admi aurat bakwas lanat
`;

export const NAMES = [MALE, FEMALE, FAMILY, INTERNATIONAL].join(" ");
