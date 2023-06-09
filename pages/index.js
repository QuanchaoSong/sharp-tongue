import React from 'react';
import Head from 'next/head';
import axios from 'axios';
import { Inter } from 'next/font/google';
// import Dropzone from 'react-dropzone';
import Dropzone from '@/components/Dropzone.js';
import LoadingCircle from '@/components/loading_circle.js';

const inter = Inter({ subsets: ['latin'] })

const BASE_URL = "http://127.0.0.1:5000/";
const client = axios.create({
  baseURL: BASE_URL,
  timeout: (20 * 60 * 1000),
});

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.local_image_file = null;

    this.state = { is_generating: false, local_file_url: "", remote_url: "", elements: [], comments_by_elements: [], comments_by_context: [], face_info: {} }

    this.when_dropped = this.when_dropped.bind(this);
    this.try_to_generate = this.try_to_generate.bind(this);
  }

  componentDidMount() {
  }

  when_dropped(file_list) {
    // console.log("file_list:", file_list[0]);
    if (file_list.length == 0) {
      return;
    }

    window.URL.revokeObjectURL(this.state.local_file_url);

    this.local_image_file = file_list[0];
    const local_file_url = URL.createObjectURL(this.local_image_file);
    console.log("local_file_url:", this.local_image_file);
    this.setState({
      local_file_url: local_file_url,
    });


  }

  ask_server_to_analyze_remote_url(image_url) {
    const that = this;
    client.post("analyze_image_url", {
      image_url: image_url
    })
      .then(function (response) {
        const resp_json = response["data"];
        const code = resp_json["code"].toString();
        if (code != 1) {
          this.setState({
            is_generating: false,
          });
          alert("Error!");
          return;
        }

        const data_dict = resp_json["data"];
        console.log("data_dict:", data_dict);
        const elements = data_dict["elements"];
        const comments_by_elements = data_dict["comments_by_elements"];
        const comments_by_context = data_dict["comments_by_context"]
        const face_info = data_dict["face"]

        that.setState({
          is_generating: false,
          elements: elements,
          comments_by_elements: comments_by_elements,
          comments_by_context: comments_by_context,
          face_info: face_info
        });
      })
      .catch(function (error) {
        console.log("error:", error);
      });
  }

  ask_server_to_analyze_local_image() {
    if (this.local_image_file == null) {
      return;
    }

    let form_data = new FormData();
    form_data.append("img", this.local_image_file);

    const that = this;
    let headers = {
      'Content-Type': 'multipart/form-data'
    }
    client.post("analyze_image_data", form_data, { headers: headers }
    )
      .then(response => {
        const resp_json = response["data"];
        const code = resp_json["code"].toString();
        if (code != 1) {
          this.setState({
            is_generating: false,
          });
          alert("Error!");
          return;
        }

        const data_dict = resp_json["data"];
        console.log("data_dict:", data_dict);
        const elements = data_dict["elements"];
        const comments_by_elements = data_dict["comments_by_elements"];
        const comments_by_context = data_dict["comments_by_context"]
        const face_info = data_dict["face"]

        that.setState({
          is_generating: false,
          elements: elements,
          comments_by_elements: comments_by_elements,
          comments_by_context: comments_by_context,
          face_info: face_info
        });
      }).catch(err => {
        console.error("err:", err);
      });
  }

  try_to_generate() {
    const is_generating = this.state.is_generating;
    if (is_generating) {
      return;
    }

    const input_field = document.getElementById("image-url-input");
    const remote_url = input_field.value;
    if (remote_url !== "") {
      this.setState({
        remote_url: remote_url
      });

      this.ask_server_to_analyze_remote_url(remote_url);
    } else {
      const local_image_url = this.state.local_file_url;
      if (local_image_url == "" || local_image_url == null) {
        alert("Please input a valid image url or select a local image file from your disk");
        return;
      }

      this.ask_server_to_analyze_local_image();
    }

    this.setState({
      is_generating: true
    });
  }

  render() {
    const is_generating = this.state.is_generating;
    var image_url = this.state.remote_url;
    if (image_url == "") {
      image_url = this.state.local_file_url;
    }

    const elements = this.state.elements;
    const comments_by_elements = this.state.comments_by_elements;
    const comments_by_context = this.state.comments_by_context;
    const should_show_result = (elements.length > 0);
    var local_image_path = "";
    if (this.local_image_file != null) {
      local_image_path = this.local_image_file.path;
    }

    const face_exist = this.state.face_info["face_exist"];
    const face_desc = this.state.face_info["face_desc"];
    const comments_for_face = this.state.face_info["comments_for_face"];
    const should_render_face_area = (face_exist != null && face_exist == 1);
    return (
      <main className="container mx-auto min-h-screen py-10 px-2">
        <Head>
          <meta name="baidu-site-verification" content="code-xhQS7JO1Hs" />
          <title>Sharp Tongue</title>
          <meta name="description" content="Sharp Tongue: an AI-based sacarstic response system to images." />
          <link rel="icon" href="/codernongLogo.png" />
          <meta name="keywords" content="AI,Sharp Tongue,Sarcastic,response,openai" />
          <meta name="author" content="sharptongue.com" />
          <meta charset="UTF-8" />
          <meta name="viewport" content="initial-scale=1.0, width=device-width" />
          {/* <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" /> */}
        </Head>

        <h1 className="text-3xl text-center text-transparent bg-clip-text bg-gradient-to-r from-slate-400 via-slate-600 to-slate-800">Sharp Tongue</h1>

        <div className='max-w-xl mx-auto mt-10 mb-5'>
          <input type="text" id="image-url-input" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-purple-500 dark:focus:border-purple-500" placeholder="Input an image url" defaultValue={""} required />
        </div>

        <div className='max-w-xl mx-auto mb-2 px-1'>
          <h4 className='text-lg text-slate-600'>Or select a local image from computer:</h4>
        </div>

        <Dropzone onDrop={this.when_dropped} accept={"image/*"} file_name={local_image_path}>
        </Dropzone>

        <div className='max-w-xl mx-auto text-center flex my-5'>
          <img className='mx-auto' src={image_url}></img>
        </div>

        <div id="analyse-button" className='text-center'>
          <button type="button" onClick={this.try_to_generate} className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2">
            {is_generating ? (<div className='flex'><LoadingCircle /> Generate Sacarstic Comments</div>) : "Generate Sacarstic Comments"}
          </button>
        </div>

        <div className='max-w-xl mx-auto mt-10 bg-slate-200' style={{ height: 2 }}></div>

        <div id="result-area" className={`${should_show_result ? "" : "hidden"} mt-5 max-w-xl mx-auto`}>
          <h4 className='text-xl text-slate-700'>Sacarstic comments by elements:</h4>

          {elements.map((item, idx) => {
            return (
              <div className='my-1'>
                <h5 className='text-base text-slate-600 capitalize'>{item}</h5>
                <ul>
                  {comments_by_elements[idx].map((item2, idx2) => {
                    return (
                      <li className='text-sm text-slate-500'>{idx2 + 1}: {item2}</li>
                    );
                  })}
                </ul>
              </div>
            );
          })}

          <h4 className='text-xl text-slate-700'>Sacarstic comments by context:</h4>
          <ul>
            {comments_by_context.map((item, idx) => {
              return (
                <li className='text-sm text-slate-500'>
                  {idx + 1}: {item}
                </li>
              );
            })}
          </ul>

          {
            should_render_face_area == false ? null : (
              // <div>ahfasdfa</div>
              <div>
                <h4 className='text-xl text-slate-700'>Sacarstic comments for face: {face_desc}</h4>
                <ul>
                  {comments_for_face.map((item, idx) => {
                    return (
                      <li className='text-sm text-slate-500'>
                        {idx + 1}: {item}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )
          }

        </div>
      </main>
    );
  }
}

export default Home;