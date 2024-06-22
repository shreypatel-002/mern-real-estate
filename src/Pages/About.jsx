import React from 'react'

const About = () => {
  return (
    <section className="max-w-7xl mx-auto py-16 px-6 lg:px-8 bg-gray-200 text-gray-500 min-h-screen ">
    <div className="text-center">
      <h1 className="text-4xl font-extrabold text-indigo-600 sm:text-5xl">
        Welcome to Our CRM
      </h1>
      <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
        Revolutionizing Customer Relationship Management with cutting-edge features and intuitive design.
      </p>
    </div>

    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-500">
        <h2 className="text-2xl font-semibold text-gray-800">User-Friendly Interface</h2>
        <p className="mt-4 text-gray-600">
          Navigate effortlessly through our intuitive UI designed to boost productivity and streamline your workflow.
        </p>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-500">
        <h2 className="text-2xl font-semibold text-gray-800">Advanced Analytics</h2>
        <p className="mt-4 text-gray-600">
          Gain valuable insights with our powerful analytics tools that help you make informed decisions.
        </p>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-500">
        <h2 className="text-2xl font-semibold text-gray-800">Seamless Integration</h2>
        <p className="mt-4 text-gray-600">
          Integrate seamlessly with your existing tools and platforms to ensure a smooth transition and uninterrupted workflow.
        </p>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-500">
        <h2 className="text-2xl font-semibold text-gray-800">Customizable Features</h2>
        <p className="mt-4 text-gray-600">
          Tailor our CRM to meet your specific business needs with flexible and customizable features.
        </p>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-500">
        <h2 className="text-2xl font-semibold text-gray-800">Secure and Reliable</h2>
        <p className="mt-4 text-gray-600">
          Protect your data with our robust security measures ensuring your information is always safe and secure.
        </p>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-500">
        <h2 className="text-2xl font-semibold text-gray-800">24/7 Customer Support</h2>
        <p className="mt-4 text-gray-600">
          Receive round-the-clock support from our dedicated team, ready to assist you whenever you need help.
        </p>
      </div>
    </div>
  </section>

  )
}

export default About