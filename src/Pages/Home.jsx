import React from 'react';
import { useSelector } from 'react-redux';

const Home = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className=" bg-white/70 min-h-screen flex flex-col justify-center text-purple-500 min-w-full ml-7">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <section className="animate__animated">
        {!currentUser?.role ? (
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Welcome {currentUser.username}, Have A Nice Day
          </h2>
        ):<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
        Welcome Admin, Have A Nice Day
      </h2>}
          <p className="text-base sm:text-lg lg:text-xl mb-8">
            Manage your customer relationships with ease and efficiency.
          </p>
        </section>

        <section id="features" className="mt-16">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-8">
            Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white text-black p-6 rounded-lg shadow-md animate__animated animate__fadeInUp">
              <h4 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4">
                Feature One
              </h4>
              <p>Detail about feature one and its benefits.</p>
            </div>
            <div className="bg-white text-black p-6 rounded-lg shadow-md animate__animated animate__fadeInUp animate__delay-1s">
              <h4 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4">
                Feature Two
              </h4>
              <p>Detail about feature two and its benefits.</p>
            </div>
            <div className="bg-white text-black p-6 rounded-lg shadow-md animate__animated animate__fadeInUp animate__delay-2s">
              <h4 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4">
                Feature Three
              </h4>
              <p>Detail about feature three and its benefits.</p>
            </div>
          </div>
        </section>

        <section id="contact" className="mt-16 text-center">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8">
            Contact Us
          </h3>
          <p className="text-base sm:text-lg lg:text-xl">
            If you have any questions, feel free to reach out!
          </p>
        </section>
      </main>
    </div>
  );
};

export default Home;
