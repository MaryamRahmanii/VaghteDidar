import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <>
     
      <section className="container mx-auto px-6 py-12 sm:py-20 flex flex-col-reverse lg:flex-row items-center gap-12">
        
      
        <div className="flex-1 w-full max-w-lg mx-auto">
          
            <img className="  rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-2 overflow-hidden aspect-video flex items-center justify-center "src="./src/assets/img.jpg" alt="" />

        </div>

       
        <div className="flex-1 text-center lg:text-right space-y-6">
          <h1 className="text-2xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400 leading-snug">
            هماهنگی جلسات، بدون پیام‌بازی‌های بی‌پایان
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed max-w-md mx-auto lg:mr-0 lg:ml-auto">
            اجازه بده دیگران از بین زمان‌های خالی تو<br />
            بهترین زمانو انتخاب کنن!<br />
            نوبیتو بقیه ی کارارو انجام میده
          </p>
          <div className="flex justify-center lg:justify-start">
            <Link to="/signup" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-medium transition shadow-lg shadow-blue-500/30">
              مشاهده ی نحوه ی کار
            </Link>
          </div>
        </div>

      </section>

      
      <section className="py-12">
        <div className="container mx-auto">
          <h2 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400 mb-8">ویژگی ها</h2>
         
          <div className="flex overflow-x-auto xl:justify-center gap-4 px-8 md:px-16 pb-6 snap-x snap-mandatory" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {[
              { title: 'اتصال خودکار به تقویم', desc: 'زمان‌بندی شما همیشه بروز می‌باشد' },
              { title: 'فرم و سوالات سفارشی', desc: 'اطلاعات مورد نیاز را از کاربر بگیرید' },
              { title: 'تعریف چند نوع جلسه', desc: 'برای هر نوع جلسه مدت و قوانین تعیین کنید' },
              { title: 'دریافت هزینه جلسات', desc: 'هزینه جلسه را قبل از برگزاری آنلاین دریافت کنید' },
              { title: 'یادآوری خودکار جلسات', desc: 'با پیامک و ایمیل جلوی فراموشی را بگیرید' },
            ].map((feature, index) => (
              <div key={index} className="min-w-[260px] sm:min-w-[300px] snap-center bg-blue-600 text-white rounded-2xl p-6 flex flex-col justify-center items-center text-center shadow-md">
                <h3 className="font-bold mb-2">{feature.title}</h3>
                <p className="text-xs text-blue-100 opacity-90">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    
      <section className="py-16 container mx-auto px-6">
        <h2 className="text-2xl font-bold text-center text-blue-600 dark:text-blue-400 mb-8">کاربرد های پر طرفدار</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { title: 'برای آموزش‌دهنده‌ها', desc: 'تنظیم زمان کلاس‌ها و جلسات آموزش' },
            { title: 'برای تیم‌های فروش', desc: 'رزرو سریع دمو و جلسه معرفی محصول' },
            { title: 'برای مشاوران', desc: 'برنامه ریزی نوبت‌های مشاوره' },
            { title: 'برای فریلنسرها', desc: 'هماهنگی آسان جلسه با کارفرماها' },
          ].map((useCase, index) => (
            <div key={index} className="bg-white dark:bg-[#1f2937] border-2 border-blue-100 dark:border-gray-700 rounded-2xl p-6 text-center shadow-sm">
              <h3 className="font-bold text-blue-600 dark:text-blue-400 mb-2 text-sm sm:text-base">{useCase.title}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{useCase.desc}</p>
            </div>
          ))}
        </div>
      </section>

      
      <section className="py-12 bg-gray-50 dark:bg-[#111827] ">
        <div className="container mx-auto">
          
          <div className="flex overflow-x-auto xl:justify-center gap-6 px-8 md:px-16 pb-8 snap-x snap-mandatory items-stretch" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            
          
            <div className="min-w-[280px] snap-center bg-white dark:bg-[#1f2937] border-2 border-blue-100 dark:border-gray-700 rounded-3xl p-8 flex flex-col justify-center items-center text-center">
              <p className="text-blue-600 dark:text-blue-400 font-bold mb-4">مورد اعتماد بیش از ۳۰۰۰ کاربر</p>
              <p className="text-blue-600 dark:text-blue-400 font-bold">بیش از ۱۰,۰۰۰ جلسه با نوبیتو هماهنگ شده است</p>
            </div>

           
            <div className="min-w-[280px] snap-center bg-blue-200/50 dark:bg-blue-900/30 rounded-3xl p-8 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">پلن رایگان</h3>
                <ul className="text-xs space-y-2 text-gray-700 dark:text-gray-300 mb-6 text-center leading-relaxed">
                  <li>ساخت یک لینک رزرو ساده</li>
                  <li>انتخاب روز و ساعت‌های قابل رزرو</li>
                  <li>اتصال به تقویم گوگل (One-way)</li>
                  <li>اعلان ایمیلی هنگام رزرو</li>
                  <li>محدودیت تعداد رزرو ماهانه</li>
                </ul>
              </div>
              <div className="text-center">
                <p className="font-bold mb-4 text-gray-800 dark:text-white">رایگان</p>
                <Link to="/signup" className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-full text-sm font-medium transition">شروع رایگان</Link>
              </div>
            </div>

            
            <div className="min-w-[280px] snap-center bg-blue-400 dark:bg-blue-600 rounded-3xl p-8 flex flex-col justify-between text-white">
              <div>
                <h3 className="text-xl font-bold mb-4 text-center">پلن حرفه ای</h3>
                <ul className="text-xs space-y-2 mb-6 text-center leading-relaxed text-blue-50">
                  <li>لینک‌های رزرو متعدد</li>
                  <li>یادآوری پیامکی قبل از جلسه</li>
                  <li>اتصال مستقیم به Google Meet</li>
                  <li>فرم کوتاه قبل از رزرو</li>
                </ul>
              </div>
              <div className="text-center">
                <p className="font-bold mb-4">۲۹۰,۰۰۰ تومان</p>
                <button className="w-full bg-blue-600 dark:bg-blue-800 hover:bg-blue-700 text-white py-2 rounded-full text-sm font-medium transition border border-white/20">انتخاب پلن</button>
              </div>
            </div>

            
            <div className="min-w-[280px] snap-center bg-blue-600 dark:bg-blue-800 rounded-3xl p-8 flex flex-col justify-between text-white shadow-xl shadow-blue-600/20">
              <div>
                <h3 className="text-xl font-bold mb-4 text-center">پلن تیمی</h3>
                <ul className="text-xs space-y-2 mb-6 text-center leading-relaxed text-blue-100">
                  <li>ایجاد چند کاربر در یک تیم</li>
                  <li>تقسیم رزروها بین اعضا</li>
                  <li>مدیریت دسترسی‌های پایه</li>
                  <li>گزارش رزروهای هر عضو</li>
                </ul>
              </div>
              <div className="text-center">
                <p className="font-bold mb-4">۴۵۰,۰۰۰ تومان</p>
                <button className="w-full bg-blue-400 hover:bg-blue-500 text-white py-2 rounded-full text-sm font-medium transition">انتخاب پلن</button>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
};

export default Landing;