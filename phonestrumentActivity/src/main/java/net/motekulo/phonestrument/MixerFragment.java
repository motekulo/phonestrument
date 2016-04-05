/*
 * Copyright (C) 2016 Denis Crowdy
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package net.motekulo.phonestrument;

import android.app.Fragment;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.TextView.OnEditorActionListener;
import android.widget.Toast;
import android.widget.ToggleButton;

import net.motekulo.phonestrument.HorizontalFader.HorizontalFaderPositionListener;
import net.motekulo.phonestrument.VerticalFader.VerticalFaderPositionListener;

import org.apache.commons.io.FileUtils;
import org.puredata.core.PdBase;

import java.io.File;
import java.io.IOException;

//import android.support.v4.app.Fragment;

public class MixerFragment extends Fragment implements OnClickListener{

	protected static final String APP_NAME = "Phonstrument";
	private EditText exportNameTextView;
	private String currentProjectName;
	//	private boolean pdServiceConnection = false;
	//	private PdService pdService = null;
	private ImageButton recButton;
	private ImageButton stopButton;
	//private SeekBar synth1Pan;
	private HorizontalFader synth1Pan;

	private HorizontalFader synth2Pan;
	private HorizontalFader dr1Pan;
	private HorizontalFader dr2Pan;
	private HorizontalFader dr3Pan;
	private HorizontalFader dr4Pan;
	private VerticalFader synth1Vol;
	private VerticalFader synth2Vol;
	private VerticalFader dr1Vol;
	private VerticalFader dr2Vol;
	private VerticalFader dr3Vol;
	private VerticalFader dr4Vol;
	private ToggleButton mainSwitch;

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {

		View view = inflater.inflate(R.layout.mixer, container, false);

		readPreferences();

		//		recButton = (ImageButton) view.findViewById(R.id.button1);
		//		recButton.setOnClickListener(this);
		//
		//		stopButton = (ImageButton) view.findViewById(R.id.button2);
		//		stopButton.setOnClickListener(this);

		mainSwitch = (ToggleButton) view.findViewById(R.id.mainSwitch);
		mainSwitch.setChecked(true);
		mainSwitch.setOnClickListener(this);



		dr1Pan = (HorizontalFader) view.findViewById(R.id.horFader1);
		dr1Pan.setPositionListener(horFaderChanged);

		dr2Pan = (HorizontalFader) view.findViewById(R.id.horFader2);
		dr2Pan.setPositionListener(horFaderChanged);

		dr3Pan = (HorizontalFader) view.findViewById(R.id.horFader3);
		dr3Pan.setPositionListener(horFaderChanged);

		dr4Pan = (HorizontalFader) view.findViewById(R.id.horFader4);
		dr4Pan.setPositionListener(horFaderChanged);


		dr1Vol = (VerticalFader) view.findViewById(R.id.verticalFader1);
		dr1Vol.setPositionListener(faderChanged);

		dr2Vol = (VerticalFader) view.findViewById(R.id.verticalFader2);
		dr2Vol.setPositionListener(faderChanged);

		dr3Vol = (VerticalFader) view.findViewById(R.id.verticalFader3);
		dr3Vol.setPositionListener(faderChanged);

		dr4Vol = (VerticalFader) view.findViewById(R.id.verticalFader4);
		dr4Vol.setPositionListener(faderChanged);

		exportNameTextView = (EditText) view.findViewById(R.id.editText1);
		exportNameTextView.setOnEditorActionListener(projectNameEditorChanged);

		exportNameTextView.setText(currentProjectName);

		return view;

	}

    @Override
    public void onResume() {
        super.onResume();
        readPreferences();
        exportNameTextView.setText(currentProjectName);
    }

	private TextView.OnEditorActionListener projectNameEditorChanged =  new OnEditorActionListener() {
		@Override
		public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {

			boolean handled = false;

			if (actionId == EditorInfo.IME_ACTION_DONE) {
				InputMethodManager imm = (InputMethodManager)getActivity().getSystemService(
						Context.INPUT_METHOD_SERVICE);
				imm.hideSoftInputFromWindow(exportNameTextView.getWindowToken(), 0);
				//Log.i(APP_NAME, "changed name to " + v.getText());

				String renamedProjectName = v.getText().toString().trim();
                String dataPath = getActivity().getExternalFilesDir(null).getPath();
                File appDir = new File(dataPath, net.motekulo.phonestrument.PhonestrumentActivity.APP_DATA_DIR_NAME);

                File oldProjectDir = new File(appDir, currentProjectName);
                File newProjectDir = new File(appDir, renamedProjectName);

                if (newProjectDir.isDirectory() == true) {
                    // project exists already so abandon ship
                    Context context = getActivity().getApplicationContext();
                    CharSequence text = "That project exists already - please try another name";
                    int duration = Toast.LENGTH_SHORT;

                    Toast toast = Toast.makeText(context, text, duration);
                    toast.show();

                } else {

                    try {
                        FileUtils.moveDirectory(oldProjectDir, newProjectDir);
                    } catch (IOException e) {
                        // TODO Auto-generated catch block
                        e.printStackTrace();
                    }
                }



				currentProjectName = renamedProjectName;
				SharedPreferences preferences = getActivity().getSharedPreferences("Phonestrument", 0);

				SharedPreferences.Editor editor = preferences.edit();

				editor.putString("CurrentProjectName", currentProjectName);
				editor.commit();

			}	

			handled = true;

			return handled;
		}
	};



	private HorizontalFader.HorizontalFaderPositionListener horFaderChanged = new HorizontalFaderPositionListener() {
		@Override
		public void onPositionChange(View fader, int newPosition) {
			float panValue = (float) newPosition / 100;
			switch (fader.getId()) {

			case R.id.horFader1:
				PdBase.sendFloat("dr1_pan", panValue);
                Log.i(APP_NAME, "Pan 1: " + panValue);
				break;

			case R.id.horFader2:
				PdBase.sendFloat("dr2_pan", panValue);
				break;

			case R.id.horFader3: 
				PdBase.sendFloat("dr3_pan", panValue);
				break;

			case R.id.horFader4:
				PdBase.sendFloat("dr4_pan", panValue);
				break;

			}
		}
	};

	private VerticalFader.VerticalFaderPositionListener faderChanged = new VerticalFaderPositionListener() {
		@Override
		public void onPositionChange(View fader, int newPosition) {
			float volValue = (float) newPosition / 100;
            double y;
			switch (fader.getId()) {

			case R.id.verticalFader1:
                PdBase.sendFloat("dr1_vol", volValue);
                Log.i(APP_NAME, "Vol 1: " + volValue);
				break;

			case R.id.verticalFader2:
				PdBase.sendFloat("dr2_vol", volValue);
                Log.i(APP_NAME, "Vol 2: " + volValue);
				break;

			case R.id.verticalFader3:
				PdBase.sendFloat("dr3_vol", volValue);
                Log.i(APP_NAME, "Vol 3: " + volValue);
				break;

			case R.id.verticalFader4:
				PdBase.sendFloat("dr4_vol", volValue);
                Log.i(APP_NAME, "Vol 4: " + volValue);
				break;

			}
		}
	};

	private void readPreferences() {
		SharedPreferences preferences = getActivity().getSharedPreferences("Phonestrument", Context.MODE_PRIVATE);
		currentProjectName = preferences.getString("CurrentProjectName", "untitled");

	}

	@Override
	public void onClick(View v) {
		switch(v.getId()) {
		/*case R.id.button1:
			// Start recording
			String filepath = Environment.getExternalStorageDirectory().getPath();
			File appdir = new File(filepath, PhonestrumentActivity.APP_DATA_DIR_NAME);

			if (!appdir.exists()) {
				appdir.mkdirs();
			}

			File exportFile = new File(appdir, currentProjectName);

			PdBase.sendMessage("set_record_file", exportFile.getAbsolutePath(), 0);
			recButton.setImageResource(R.drawable.recording);

			break;

		case R.id.button2:
			// Stop recording
			PdBase.sendBang("stop_rec");
			recButton.setImageResource(R.drawable.record);
			break;*/


		case R.id.mainSwitch:
			toggleMainSwitch();

			break;
		}
	}

	private void toggleMainSwitch() {
		PdBase.sendBang("metro_on");
		if (mainSwitch.isChecked() == true) {
		}

		if (mainSwitch.isChecked() == false) {
			PdBase.sendFloat("metro_on", 0);
		}

	}

}
