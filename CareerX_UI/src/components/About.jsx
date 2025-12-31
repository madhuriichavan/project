import { motion } from "framer-motion";

const itemLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const itemRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const About = () => {
  return (
    <div className="bg-[#F5EFE8] min-h-screen">
      {/* Hero / Intro Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-[#2F4156] mb-4">
          About CareerX
        </h1>
        <p className="text-[#2F4156] max-w-3xl mx-auto">
          CareerX is a personalized career guidance platform designed to help
          students make informed decisions from early academics to professional
          careers using assessments, AI-driven insights, and structured
          roadmaps.
        </p>
      </div>

      {/* Mission / Vision Timeline */}
      <div className="bg-[#C8D9E6] py-20">
        <div className="max-w-7xl mx-auto px-4">
                  <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-1/2 top-0 h-full w-1 bg-[#2F4156] transform -translate-x-1/2 hidden md:block"></div>
            <div className="absolute left-4 top-0 h-full w-1 bg-[#2F4156] md:hidden"></div>

            {/* Mission */}
            <motion.div
              className="mb-16 md:w-1/2 md:pr-12 md:text-right relative"
              variants={itemLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="bg-white p-8 rounded-xl shadow-sm inline-block">
                <h3 className="text-2xl font-semibold text-[#2F4156] mb-4">
                  Our Mission
                </h3>
                <p className="text-[#2F4156]">
                  To empower students with clarity, confidence, and direction by
                  providing structured career guidance tailored to individual
                  interests and abilities.
                </p>
              </div>

              {/* Dot */}
              <span className="hidden md:block absolute right-0 top-8 w-4 h-4 bg-[#2F4156] rounded-full"></span>
            </motion.div>

            {/* Vision */}
            <motion.div
              className="md:ml-auto md:w-1/2 md:pl-12 relative"
              variants={itemRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <div className="bg-white p-8 rounded-xl shadow-sm inline-block">
                <h3 className="text-2xl font-semibold text-[#2F4156] mb-4">
                  Our Vision
                </h3>
                <p className="text-[#2F4156]">
                  To become a trusted digital companion for students, guiding
                  them from school education to successful careers through
                  technology and expert-driven insights.
                </p>
              </div>

              {/* Dot */}
              <span className="hidden md:block absolute left-0 top-8 w-4 h-4 bg-[#2F4156] rounded-full"></span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Team Section (Based on Provided Layout) */}
      <div className="bg-[#F5EFE8] pt-15">
        <h2 className="text-3xl font-bold text-center text-[#2F4156] mb-15">
          Meet the Developers
        </h2>

        <div className="max-w-7xl mx-auto px-4 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {/* Developer Card */}
          <div className="bg-[#DCE5E2] rounded-t-full overflow-hidden text-center p-6">
            <img
              src="https://i.postimg.cc/65VgHMf2/d.jpg"
              alt="Developer"
              className="mx-auto rounded-full grayscale w-32 h-37 object-cover mb-4"
            />
            <h3 className="font-semibold text-[#2F4156]">Darshan</h3>
            <p className="text-sm text-[#2F4156]">Backend Developer</p>
            <p className="text-sm text-[#2F4156]">
              Developed and managed server-side logic, databases, and
              authentication to ensure secure and efficient application
              functionality.
            </p>
          </div>

          <div className="bg-[#FADADD] rounded-t-full overflow-hidden text-center p-6">
            <img
              src="https://i.postimg.cc/3NwMmpzc/m.jpg"
              alt="Developer"
              className="mx-auto rounded-full grayscale w-32 h-37 object-cover mb-4"
            />
            <h3 className="font-semibold text-[#2F4156]">Madhuri</h3>
            <p className="text-sm text-[#2F4156]">Frontend Developer</p>
            <p className="text-sm text-[#2F4156]">
              Built responsive and interactive user interfaces using modern web
              technologies to ensure a smooth and engaging user experience.
            </p>
          </div>

          <div className="bg-[#EAE2D6] rounded-t-full overflow-hidden text-center p-6">
            <img
              src="https://i.postimg.cc/VLZdpWRS/r.jpg"
              alt="Developer"
              className="mx-auto rounded-full grayscale w-32 h-37 object-cover mb-4"
            />
            <h3 className="font-semibold text-[#2F4156]">Ronak</h3>
            <p className="text-sm text-[#2F4156]">API Developer</p>
            <p className="text-sm text-[#2F4156]">
              Designed and integrated APIs to enable seamless communication
              between frontend, backend, and external services.
            </p>
          </div>

          <div className="bg-[#FFD54F] rounded-t-full overflow-hidden text-center p-6">
            <img
              src="https://i.postimg.cc/L4JNYNbw/s.jpg"
              alt="Developer"
              className="mx-auto rounded-full grayscale w-32 h-37 object-cover mb-4"
            />
            <h3 className="font-semibold text-[#2F4156]">Samiksha</h3>
            <p className="text-sm text-[#2F4156]">UI/UX Designer</p>
            <p className="text-sm text-[#2F4156]">
              Created intuitive, user-friendly designs focused on usability,
              accessibility, and visually appealing experiences..
            </p>
          </div>

          <div className="bg-[#C8D9E6] rounded-t-full overflow-hidden text-center p-6">
            <img
              src="https://i.postimg.cc/L5t9rDCw/Aryan-Gawade.jpg"
              alt="Developer"
              className="mx-auto rounded-full grayscale w-32 h-37 object-cover mb-4"
            />
            <h3 className="font-semibold text-[#2F4156]">Aryan</h3>
            <p className="text-sm text-[#2F4156]">Data Engineer</p>
            <p className="text-sm text-[#2F4156]">
              Analyzed data to support intelligent features, insights, and
              data-driven decision making.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
